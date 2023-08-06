import { expect } from 'chai'
import hre, { artifacts } from 'hardhat'
import { BrokerAccepter, MockToken, ZkLink } from '../../typechain-types'
import { Wallet, ethers, getAddress } from 'ethers'
import { parseEther, toUtf8Bytes, keccak256, solidityPacked } from 'ethers'
import { ec as EC } from 'elliptic'
import { arrayify } from '@ethersproject/bytes'
import {
  IOrderedRequestStore,
  PackedTransaction,
  Request,
} from 'parallel-signer'
const witnessWallet = Wallet.createRandom()
process.env.WITNESS_SINGER_PRIVATE_KEY = witnessWallet.privateKey
process.env.ZKLINK_RPC_ENDPOINT = 'https://aws-gw-v2.zk.link'
import { zklinkRpcClient } from '../../src/witness/client'

import { fetchChains } from '../../src/utils/chains'
import { SignTxsReturns, signTxs } from '../../src/witness/routers/signTxs'
import { getFastWithdrawTxs } from '../../src/witness/routers/getFastWithdrawTxs'
import {
  __encodeRequestsData,
  encodeRequestsData,
} from '../../src/broker/parallel'
import { Address, TxHash } from '../../src/types'

const BROKER_ROLE = keccak256(toUtf8Bytes('BROKER_ROLE'))
const WITNESS_ROLE = keccak256(toUtf8Bytes('WITNESS_ROLE'))
const FUND_ROLE = keccak256(toUtf8Bytes('FUND_ROLE'))
type AcceptEnentType = {
  from: string
  to: string
  amount: BigInt
}
describe('witness:signTxs', function () {
  let broker: BrokerAccepter
  let token: MockToken
  let zklink: ZkLink
  let brokerAddress
  let tokenAddress
  beforeEach(async function () {
    zklink = await hre.ethers.deployContract('ZkLink')
    broker = await hre.ethers.deployContract('BrokerAccepter', [
      await zklink.getAddress(),
      1, //second
    ])
    brokerAddress = await broker.getAddress()
    token = await hre.ethers.deployContract('MockToken')
    tokenAddress = await token.getAddress()
    const transferTx = await token.transfer(
      brokerAddress,
      parseEther('1000000000000000')
    )

    await fetchChains()
    //__setChainInfo for test
  })
  it('signTxs should be ok', async function () {
    async function requestWitnessSignature(
      txs: TxHash[],
      mainContract: Address
    ): Promise<SignTxsReturns> {
      return new Promise((resolve, reject) => {
        signTxs([txs, mainContract], (err, sigObj) => {
          if (err) {
            reject(err)
          }
          resolve(sigObj)
        })
      })
    }
    let totalAmount = BigInt(0)
    let acceptEventArray: AcceptEnentType[] = []
    let { signature, result } = (await new Promise((resolve, reject) => {
      getFastWithdrawTxs(
        ['2023-08-05T02:08:56.491244Z', 20],
        async (err, result) => {
          if (err) {
            reject(err)
          }
          for (let v of result) {
            const tx = v.tx
            const tokenid = tx.l1TargetToken
            await zklink.setTokenId(tokenid, tokenAddress)

            if (tx.type === 'ForcedExit') {
              totalAmount += BigInt(tx.exitAmount)
              acceptEventArray.push({
                from: brokerAddress,
                to: tx.target,
                amount: BigInt(tx.exitAmount),
              })
            } else if (tx.type === 'Withdraw') {
              totalAmount += BigInt(tx.amount)
              acceptEventArray.push({
                from: brokerAddress,
                to: tx.to,
                amount:
                  (BigInt(tx.amount) * BigInt(10000 - tx.withdrawFeeRatio)) /
                  BigInt(10000),
              })
            } else {
              throw new Error('type error')
            }
          }
          const txhashs = result.map((v) => {
            return v.txHash
          })

          const signRes = await requestWitnessSignature(txhashs, brokerAddress)
          resolve({ signature: signRes.signature, result })
        }
      )
    })) as { signature: string; result: Array<any> }
    const [datas, amounts] = await __encodeRequestsData(
      result.map((v) => {
        return {
          functionData: JSON.stringify(v),
          chainId: 0,
        } as Request
      }),
      brokerAddress
    )
    const [owner, Alice, Bob] = await hre.ethers.getSigners()

    await broker.grantBrokerRole(Alice)
    await broker.grantWitnessRole(witnessWallet.address)
    const zkLinkAddress = await zklink.getAddress()
    const approvezklinkTx = await broker.approveZkLink(
      tokenAddress,
      totalAmount
    )
    await expect(approvezklinkTx)
      .to.emit(token, 'Approval')
      .withArgs(brokerAddress, zkLinkAddress, totalAmount)

    const accTx = await broker
      .connect(Alice)
      .batchAccept(datas, amounts, signature)

    console.log(acceptEventArray)
    for (let v of acceptEventArray) {
      await expect(accTx)
        .to.emit(zklink, 'Accept')
        .withArgs(v.from, getAddress(v.to), v.amount)
    }
  })
})

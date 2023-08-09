import { expect } from 'chai'
import hre from 'hardhat'
import { BrokerAccepter, MockToken, ZkLink } from '../../typechain-types'
import { Wallet, getAddress } from 'ethers'
import { parseEther } from 'ethers'
import { Request } from 'parallel-signer'
import dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.APP_ENV}`, override: true })
dotenv.config({ path: `.env.${process.env.APP_ENV}.local`, override: true })

if (!process.env.WITNESS_SINGER_PRIVATE_KEY) {
  process.env.WITNESS_SINGER_PRIVATE_KEY = Wallet.createRandom().privateKey
}
const witnessWallet = new Wallet(process.env.WITNESS_SINGER_PRIVATE_KEY)

import { fetchChains } from '../../src/utils/chains'
import { SignTxsReturns, signTxs } from '../../src/witness/routers/signTxs'
import { getFastWithdrawTxs } from '../../src/witness/routers/getFastWithdrawTxs'
import { __encodeRequestsData } from '../../src/broker/parallel'
import { Address, TxHash } from '../../src/types'

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
      1 //second
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
      getFastWithdrawTxs([1691201336491000, 2], async (err, result) => {
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
              amount: BigInt(tx.exitAmount)
            })
          } else if (tx.type === 'Withdraw') {
            totalAmount += BigInt(tx.amount)
            acceptEventArray.push({
              from: brokerAddress,
              to: tx.to,
              amount:
                (BigInt(tx.amount) * BigInt(10000 - tx.withdrawFeeRatio)) /
                BigInt(10000)
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
      })
    })) as { signature: string; result: Array<any> }
    const [datas, amounts] = await __encodeRequestsData(
      result.map((v) => {
        return {
          functionData: JSON.stringify(v),
          chainId: 0
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
    const receipt = await accTx.wait()

    let acceptStatusLogCount = 0
    if (receipt.logs) {
      for (const log of receipt.logs) {
        try {
          const parseLog = broker.interface.parseLog(log)
          if (parseLog.name === 'AcceptStatus') {
            acceptStatusLogCount += 1
          }
        } catch (error) {}
      }
    }
    expect(acceptStatusLogCount).to.be.eq(datas.length)
    for (let i = 0; i < datas.length; i++) {
      await expect(accTx)
        .to.emit(broker, 'AcceptStatus')
        .withArgs(datas[i], amounts[i], true)
    }

    for (let v of acceptEventArray) {
      await expect(accTx)
        .to.emit(zklink, 'Accept')
        .withArgs(v.from, getAddress(v.to), v.amount)
    }
  })
})

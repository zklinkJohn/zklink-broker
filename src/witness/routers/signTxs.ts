import { arrayify } from '@ethersproject/bytes'
import { ec as EC } from 'elliptic'
import { hexlify, keccak256, solidityPacked } from 'ethers'
import { MethodExecuteCallbackType } from 'jayson'
import { WITNESS_SINGER_PRIVATE_KEY } from '../../conf'
import { isGasToken } from '../../utils/chains'
import { encodeAcceptERC20, encodeAcceptETH } from '../../utils/encodeData'
import { zklinkRpcClient } from '../client'
import { RPCError } from '../errors'
const MAX_ACCEPT_FEE_RATE = BigInt(10000)
type TxHash = string
type Address = string
type SignTxsParams = [TxHash[], Address]
export type SignTxsReturns = { signature: string }
export async function signTxs(
  params: SignTxsParams,
  callback: MethodExecuteCallbackType
) {
  try {
    const [txHashs, acceptor] = params
    const txDatas = []
    for (let v of txHashs) {
      const response = await zklinkRpcClient.request('getTransactionByHash', [
        v,
        false,
      ])

      if (response.error) {
        throw response.error
      } else {
        if (
          response.result &&
          'tx' in response.result &&
          'receipt' in response.result
        ) {
          if (
            response.result['tx']['accountId'] === undefined &&
            typeof response.result['tx']['target'] === 'string' &&
            response.result['tx']['target'].length === 42
          ) {
            const accountRes = await zklinkRpcClient.request('getAccount', [
              response.result['tx']['target'],
            ])
            if (accountRes.error) {
              throw accountRes.error
            }

            if (
              accountRes['result'] &&
              typeof accountRes['result']['id'] === 'number'
            ) {
              response.result['tx']['accountId'] = accountRes['result']['id']
            } else {
              throw new RPCError('can not find accountid')
            }
          }
          txDatas.push(response.result)
        } else {
          throw new RPCError('can not find tx and receipt field')
        }
      }
    }

    const functionDatas = txDatas.map((v) => {
      let tx = v.tx
      let receipt = v.receipt

      if (receipt['executed'] !== true || receipt['success'] !== true) {
        throw new Error('executed and success should be true ')
      }

      if (tx['type'] === 'Withdraw' && tx['fastWithdraw'] === 1) {
        const amount = BigInt(tx['amount'])
        return isGasToken(tx['l1TargetToken'])
          ? encodeAcceptETH([
              acceptor,
              tx['accountId'],
              tx['to'],
              amount,
              tx['withdrawFeeRatio'],
              tx['accountId'],
              tx['subAccountId'],
              tx['nonce'],
            ])
          : encodeAcceptERC20([
              acceptor,
              tx['accountId'],
              tx['to'],
              tx['l1TargetToken'],
              amount,
              tx['withdrawFeeRatio'],
              tx['accountId'],
              tx['subAccountId'],
              tx['nonce'],
              (amount *
                (MAX_ACCEPT_FEE_RATE - BigInt(tx['withdrawFeeRatio']))) /
                MAX_ACCEPT_FEE_RATE,
            ])
      }

      if (tx['type'] === 'ForcedExit') {
        const amount = BigInt(tx['exitAmount'])
        return isGasToken(tx['l1TargetToken'])
          ? encodeAcceptETH([
              acceptor,
              tx['accountId'],
              tx['target'],
              amount,
              0, //withdrawFeeRatio
              tx['initiatorAccountId'],
              tx['initiatorSubAccountId'],
              tx['initiatorNonce'],
            ])
          : encodeAcceptERC20([
              acceptor,
              tx['accountId'],
              tx['target'],
              tx['l1TargetToken'],
              amount,
              0,
              tx['initiatorAccountId'],
              tx['initiatorSubAccountId'],
              tx['initiatorNonce'],
              amount,
            ])
      }

      throw new Error('tx.type should be ForcedExit or Withdraw')
    })

    const digest = keccak256(
      encodePacked(functionDatas.map((v) => ['bytes', arrayify(v)]))
    )

    const ec = new EC('secp256k1')

    const keypair = ec.keyFromPrivate(arrayify(WITNESS_SINGER_PRIVATE_KEY))
    const signature = keypair.sign(arrayify(digest), { canonical: true })
    const sig = new Uint8Array(65)
    sig.set(Buffer.from(signature.r.toArray()), 0)
    sig.set(Buffer.from(signature.s.toArray()), 32)
    sig.set(signature.recoveryParam ? arrayify('0x1c') : arrayify('0x1b'), 64)

    callback(null, {
      signature: hexlify(sig),
    } as SignTxsReturns)
  } catch (e: any) {
    callback(new RPCError(e?.message))
  }
}

function encodePacked(params = []) {
  let types = []
  let values = []

  params.forEach((itemArray) => {
    types.push(itemArray[0])
    values.push(itemArray[1])
  })

  return solidityPacked(types, values)
}

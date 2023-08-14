import { arrayify } from '@ethersproject/bytes'
import { ec as EC } from 'elliptic'
import { hexlify, keccak256, solidityPacked } from 'ethers'
import { MethodExecuteCallbackType } from 'jayson'
import { WITNESS_SINGER_PRIVATE_KEY } from '../../conf'
import {
  buildFastWithdrawFromTx,
  buildForcedExitFromTx
} from '../../utils/encodeData'
import { zklinkRpcClient } from '../client'
import { RPCError } from '../errors'
import { FastWithdrawRow, ForcedExitRow } from '../../utils/withdrawal'
import { Address, ChainId, TxHash } from '../../types'
export type SignTxsParams = [TxHash[], Address, ChainId]
export type SignTxsReturns = { signature: string }
export async function signTxs(
  params: SignTxsParams,
  callback: MethodExecuteCallbackType
) {
  try {
    const [txHashs, acceptor, chainId] = params
    const datas = []
    for (let v of txHashs) {
      const response = await zklinkRpcClient.request('getTransactionByHash', [
        v,
        false
      ])

      if (response.error) {
        throw response.error
      }
      //re org data
      const receipt = response.result['receipt']
      if (receipt['executed'] !== true || receipt['success'] !== true) {
        throw new Error('executed and success should be true ')
      }

      response.result['executedTimestamp'] = receipt['executedTimestamp']
      let data: string
      if (response.result.tx.type === 'ForcedExit') {
        ;[data] = await buildForcedExitFromTx(
          response.result as ForcedExitRow,
          acceptor,
          chainId
        )
      } else if (response.result.tx.type === 'Withdraw') {
        ;[data] = await buildFastWithdrawFromTx(
          response.result as FastWithdrawRow,
          acceptor,
          chainId
        )
      } else {
        throw new Error('fastwithdraw type should be forcedExit or withdraw')
      }

      datas.push(data)
    }

    const digest = keccak256(
      encodePacked(datas.map((v) => ['bytes', arrayify(v)]))
    )
    const ec = new EC('secp256k1')
    const keypair = ec.keyFromPrivate(arrayify(WITNESS_SINGER_PRIVATE_KEY))
    const signature = keypair.sign(arrayify(digest), { canonical: true })
    const sig = new Uint8Array(65)
    sig.set(Buffer.from(signature.r.toArray()), 0)
    sig.set(Buffer.from(signature.s.toArray()), 32)
    sig.set(signature.recoveryParam ? arrayify('0x1c') : arrayify('0x1b'), 64)
    callback(null, {
      signature: hexlify(sig)
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

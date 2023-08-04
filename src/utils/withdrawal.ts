import { dataSlice } from 'ethers'
import { Address, ChainId, HexString, L2ChainId } from '../types'
import { arrayify } from '@ethersproject/bytes'
export type FastWithdrawTxsResp = ForcedExitRow | FastWithdrawRow

export interface ForcedExitRow {
  txHash: string
  tx: {
    type: 'ForcedExit'
    toChainId: number
    initiatorAccountId: number
    initiatorSubAccountId: number
    initiatorNonce: number
    target: string
    targetSubAccountId: number
    l2SourceToken: number
    l1TargetToken: number
    exitAmount: string
    signature: {
      pubKey: string
      signature: string
    }
    ts: number
  }
  executedTimestamp: string
}

export interface FastWithdrawRow {
  txHash: string
  tx: {
    type: 'Withdraw'
    toChainId: number
    accountId: number
    subAccountId: number
    to: string
    l2SourceToken: number
    l1TargetToken: number
    amount: string
    fee: string
    nonce: number
    signature: {
      pubKey: string
      signature: string
    }
    fastWithdraw: number
    withdrawFeeRatio: number
    ts: number
  }
  executedTimestamp: string
}

export interface WithdrawalEventParams {
  chainId: ChainId
  recepient: Address
  tokenId: number
  amount: bigint
}

export interface WithdrawalRequestParams extends WithdrawalEventParams {
  logId: number // log id, event watcher primary key
}

// compress the bytes32 address to bytes20
// 0x000000000000000000000000086cacda48e8a77680ba1e79177d1655f7130c95 -> 0x086cacda48e8a77680ba1e79177d1655f7130c95
export function compressAddress(address: HexString) {
  if (arrayify(address).length === 32) {
    return dataSlice(address, 12)
  }
  if (arrayify(address).length === 20) {
    return address
  }
  return address
}

// Group the requestParams data by chainId and then use ParallelSigner to send the data to each chain.
export function groupingRequestParams<
  T extends Record<L2ChainId, FastWithdrawTxsResp[]>
>(requestParams: FastWithdrawTxsResp[]): T {
  const chainIds = new Set(requestParams.map((v) => v.tx.toChainId))
  const result: T = {} as T
  chainIds.forEach((chainId) => {
    result[Number(chainId)] = requestParams.filter(
      (v) => Number(v.tx.toChainId) === Number(chainId)
    )
  })

  return result
}

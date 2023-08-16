import { Interface } from 'ethers'
import { BROKER_ACCEPTER_INTERFACE, ZKLINK_INTERFACE } from '.'
import { FastWithdrawRow, ForcedExitRow } from './withdrawal'
import { fetchAccount, getTokenDecimals, isGasToken } from './chains'
import { ChainId } from '../types'
const MAX_ACCEPT_FEE_RATE = BigInt(10000)
const TOKEN_DECIMALS_OF_LAYER2 = 18
export function encodeData(iface: Interface, funName: string, args: any[]) {
  const fragment = iface.getFunction(funName)
  return iface.encodeFunctionData(fragment, args)
}

export function encodeAcceptERC20(args: any[]) {
  return encodeData(ZKLINK_INTERFACE, 'acceptERC20', args)
}

export function encodeAcceptETH(args: any[]) {
  return encodeData(ZKLINK_INTERFACE, 'acceptETH', args)
}

export function encodeBatchAccept(args: any[]) {
  return encodeData(BROKER_ACCEPTER_INTERFACE, 'batchAccept', args)
}

export async function buildForcedExitFromTx(
  row: ForcedExitRow,
  mainContract: string,
  chainId: ChainId
): Promise<[string, bigint]> {
  const tx = row.tx
  const accountResp = await fetchAccount(tx.target)
  const _recoveryDecimals = (amount) =>
    recoveryDecimals(amount, getTokenDecimals(chainId, tx.l1TargetToken))
  const amount = _recoveryDecimals(BigInt(tx.exitAmount))

  const data = isGasToken(tx.l1TargetToken)
    ? encodeAcceptETH([
        mainContract,
        accountResp.id,
        tx.target,
        amount,
        0, //withdrawFeeRatio
        tx.initiatorAccountId,
        tx.initiatorSubAccountId,
        tx.initiatorNonce
      ])
    : encodeAcceptERC20([
        mainContract,
        accountResp.id,
        tx.target,
        tx.l1TargetToken,
        amount,
        0, //withdrawFeeRatio
        tx.initiatorAccountId,
        tx.initiatorSubAccountId,
        tx.initiatorNonce,
        amount
      ])

  const a = isGasToken(tx.l1TargetToken) ? amount : BigInt(0)
  return [data, a]
}

export async function buildFastWithdrawFromTx(
  row: FastWithdrawRow,
  mainContract: string,
  chainId: ChainId
): Promise<[string, bigint]> {
  const tx = row.tx
  const amount = BigInt(tx.amount)
  const _recoveryDecimals = (amount) =>
    recoveryDecimals(amount, getTokenDecimals(chainId, tx.l1TargetToken))

  const data = isGasToken(tx.l1TargetToken)
    ? encodeAcceptETH([
        mainContract,
        tx.accountId,
        tx.to,
        _recoveryDecimals(amount),
        tx.withdrawFeeRatio,
        tx.accountId,
        tx.subAccountId,
        tx.nonce
      ])
    : encodeAcceptERC20([
        mainContract,
        tx.accountId,
        tx.to,
        tx.l1TargetToken,
        _recoveryDecimals(amount),
        tx.withdrawFeeRatio,
        tx.accountId,
        tx.subAccountId,
        tx.nonce,
        _recoveryDecimals(
          (amount * (MAX_ACCEPT_FEE_RATE - BigInt(tx.withdrawFeeRatio))) /
            MAX_ACCEPT_FEE_RATE
        )
      ])
  const a = isGasToken(tx.l1TargetToken)
    ? _recoveryDecimals(
        (amount * (MAX_ACCEPT_FEE_RATE - BigInt(tx.withdrawFeeRatio))) /
          MAX_ACCEPT_FEE_RATE
      )
    : BigInt(0)
  return [data, a]
}

export function recoveryDecimals(amount: bigint, decimals: number): bigint {
  if (decimals === TOKEN_DECIMALS_OF_LAYER2) {
    return amount
  }
  return amount / BigInt(10) ** BigInt(TOKEN_DECIMALS_OF_LAYER2 - decimals)
}

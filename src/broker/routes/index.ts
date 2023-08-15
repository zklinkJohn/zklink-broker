import { MethodExecuteCallbackType } from 'jayson'
import { ChainId, Ether, TokenId } from '../../types'

export type TokenAmount = bigint
export type GetPriceParams = [ChainId, TokenId]
export type GetPriceReturns = {
  avalible: bigint
  fee: number // default 50/10000
}
export async function getPrice(
  params: GetPriceParams,
  callback: MethodExecuteCallbackType
) {
  const [chainId, tokenId] = params

  try {
    callback(null, {
      avalible: BigInt(5),
      fee: 50
    } as GetPriceReturns)
  } catch (e: any) {
    callback(e)
  }
}

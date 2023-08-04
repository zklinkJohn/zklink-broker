import { MethodExecuteCallbackType } from 'jayson'
import { ChainId } from '../../types'

type TokenSymbol = string
type GetPriceParams = [ChainId, TokenSymbol]

export async function getPrice(
  params: GetPriceParams,
  callback: MethodExecuteCallbackType
) {
  try {
    callback(null, {
      fee: 5,
    })
  } catch (e: any) {
    callback(e)
  }
}

import { MethodExecuteCallbackType } from 'jayson'
import { zklinkRpcClient } from '../client'

type UnixTimeString = string
type Limit = number
type GetFastWithdrawTxsParams = [UnixTimeString, Limit]

export async function getFastWithdrawTxs(
  params: GetFastWithdrawTxsParams,
  callback: MethodExecuteCallbackType
) {
  try {
    const response = await zklinkRpcClient.request('getFastWithdrawTxs', params)
    if (response.error) {
      console.log(3, response.error)
      callback(response.error)
    } else {
      callback(null, response.result)
    }
  } catch (e: any) {
    console.log(2, e)
    callback(e)
  }
}

import { MethodExecuteCallbackType } from 'jayson'

export type GetPriceReturns = {}
// read requests_resend, and group by chainid
export async function FastWithdrawMonitor(callback: MethodExecuteCallbackType) {
  //TODO @Tyral Prometheus

  try {
    callback(null, {} as GetPriceReturns)
  } catch (e: any) {
    callback(e)
  }
}

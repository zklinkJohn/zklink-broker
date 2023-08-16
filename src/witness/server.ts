import { MethodLike, Server } from 'jayson'
import { WITNESS_PORT } from '../conf'
import { fetchChains, fetchTokens } from '../utils/chains'
import { getFastWithdrawTxs } from './routers/getFastWithdrawTxs'
import { signTxs } from './routers/signTxs'

const methods: { [methodName: string]: MethodLike } = {
  getFastWithdrawTxs: getFastWithdrawTxs,
  signTxs: signTxs
}

export async function witnessServer() {
  await fetchChains()
  await fetchTokens()
  const rpcServer = new Server(methods)
  rpcServer.http().listen(WITNESS_PORT, () => {
    console.log(`Witness server running on port ${WITNESS_PORT}`)
  })
}

witnessServer().catch((e) => {
  console.log(e)
})

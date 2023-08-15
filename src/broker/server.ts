import { MethodLike, Server } from 'jayson'
import { BROKER_PORT, CHAIN_IDS } from '../conf'
import { initBlockConfirmations } from '../utils/blockConfirmations'
import { fetchChains, fetchTokens } from '../utils/chains'
import { AssistWithdraw } from './assistor'
import { getPrice } from './routes'

const methods: { [methodName: string]: MethodLike } = {
  getPrice
}

export async function brokerServer() {
  await fetchChains().catch((err) => {
    console.error(err)
  })
  await fetchTokens().catch((err) => {
    console.error(err)
  })
  await initBlockConfirmations()

  const assistor = new AssistWithdraw()
  await assistor.initSigners(CHAIN_IDS)
  assistor.watchNewFastWithdrawalTxs()
  assistor.watchResendTxs()

  const rpcServer = new Server(methods)
  rpcServer.http().listen(BROKER_PORT, () => {
    console.log(`Broker server running on port ${BROKER_PORT}`)
  })
}

brokerServer().catch((e) => {
  console.log(e)
})

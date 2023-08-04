import { Client } from 'jayson/promise'
import {
  WATCHER_SERVER_HOST,
  WATCHER_SERVER_PORT,
  WITNESS_PORT,
  ZKLINK_RPC_ENDPOINT,
} from '../conf'

export const witnessRpcClient = Client.http({
  host: '127.0.0.1',
  port: WITNESS_PORT,
})

export const watcherServerClient = Client.http({
  host: WATCHER_SERVER_HOST,
  port: WATCHER_SERVER_PORT,
})

export const zklinkRpcClient = Client.https({
  host: ZKLINK_RPC_ENDPOINT.replace(/https:\/\/|http:\/\//, ''),
})

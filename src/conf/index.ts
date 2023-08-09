import dotenv from 'dotenv'
import { ChainId } from '../types'

dotenv.config({ path: `.env.${process.env.APP_ENV}`, override: true })
dotenv.config({ path: `.env.${process.env.APP_ENV}.local`, override: true })

export const WITNESS_PORT = Number(process.env.WITNESS_PORT)
export const BROKER_PORT = Number(process.env.BROKER_PORT)

export const CHAIN_IDS: ChainId[] = process.env
  .CHAIN_IDS!.split(',')
  .map((v) => Number(v))

export const TRANSPORT_CONSOLE = true

// Postgres connection string
// e.g. "postgresql://username:password@localhost:5432/db_name"
export const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION

export const WITNESS_SINGER_PRIVATE_KEY = process.env.WITNESS_SINGER_PRIVATE_KEY

export const BROKER_SINGER_PRIVATE_KEY = process.env.BROKER_SINGER_PRIVATE_KEY

// The fee strategy is a service provided by the event watcher, with three options available: "standard", "fast", and "rapid".
export const BROKER_FEE_POLICY = process.env.BROKER_FEE_POLICY
// This number is used to control the maximum number of transactions to be merged.
export const BROKER_MAXIMUM_PACK_TX_LIMIT = Number(
  process.env.BROKER_MAXIMUM_PACK_TX_LIMIT || 10
)
// This number is used to control the maximum number of transactions to be merged.
export const BROKER_TX_GAS_LIMIT = '200000'
// When the server is first deployed or the database is reset,
// the server will initiate a scan for new fast withdrawal data at that time.
// However, if the server is restarted and the 'processed_txs' database table contains at least one record,
// the server will utilize the most recent entry in the 'processed_txs' table to proceed.
export const BROKER_STARTED_TIME = Number(process.env.BROKER_STARTED_TIME)

export const WATCHER_SERVER_HOST = process.env.WATCHER_SERVER_HOST
export const WATCHER_SERVER_PORT = process.env.WATCHER_SERVER_PORT

// Pull the pending Withdrawal logs from the block scanning service and use the submitter account to assist users with withdrawals.
export const ZKLINK_RPC_ENDPOINT = process.env.ZKLINK_RPC_ENDPOINT

// The time interval between each polling request, in milliseconds.
export const POLLING_LOGS_INTERVAL = Number(process.env.POLLING_LOGS_INTERVAL)
// The number of log entries retrieved with each polling request.
export const POLLING_LOGS_LIMIT = Number(process.env.POLLING_LOGS_INTERVAL)

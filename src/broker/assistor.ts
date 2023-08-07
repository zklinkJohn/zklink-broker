import { JsonRpcProvider } from 'ethers'
import { ParallelSigner } from 'parallel-signer'
import {
  BROKER_MAXIMUM_PACK_TX_LIMIT,
  BROKER_SINGER_PRIVATE_KEY,
  BROKER_STARTED_TIME,
  POLLING_LOGS_INTERVAL,
  POLLING_LOGS_LIMIT,
} from '../conf'
import { brokerContracts } from '../conf/chains'
import {
  insertProcessedLogs,
  selectLatestExecutedTimestamp,
} from '../db/process'
import { getBlockConfirmations } from '../utils/blockConfirmations'
import { ChainInfo, getChains } from '../utils/chains'
import { sleep } from '../utils/sleep'
import { FastWithdrawTxsResp, groupingRequestParams } from '../utils/withdrawal'
import { zklinkRpcClient } from './client'
import { OrderedRequestStore, populateTransaction } from './parallel'

export class AssistWithdraw {
  private signers: Record<number, ParallelSigner> = {}
  private timestamp: number = 0 // start log id of fetch new event logs

  async initSigners(chains: ChainInfo[]) {
    const blockConfirmations = getBlockConfirmations()
    for (let k in chains) {
      const { web3Url, layerOneChainId } = chains[k]
      const chainId = Number(layerOneChainId)

      // broker contract address for v.chainId
      const brokerContract = brokerContracts[chainId]
      if (!brokerContract) {
        throw new Error(`Can't find borker contract on ${chainId}`)
      }
      this.signers[chainId] = new ParallelSigner(
        BROKER_SINGER_PRIVATE_KEY,
        new JsonRpcProvider(web3Url, {
          name: '',
          chainId: chainId,
        }),
        new OrderedRequestStore(),
        populateTransaction(chainId, brokerContract),
        {
          requestCountLimit: BROKER_MAXIMUM_PACK_TX_LIMIT,
          confirmations: blockConfirmations[chainId],
        }
      )
      this.signers[chainId].init()
    }
  }

  async submitTransactions(rows: FastWithdrawTxsResp[]) {
    const chains = getChains()
    const groupedRequests = groupingRequestParams(rows)
    for (let l2ChainId in groupedRequests) {
      const { layerOneChainId } = chains.find(
        (v) => Number(v.chainId) === Number(l2ChainId)
      )
      const txs = groupedRequests[l2ChainId].map((v) => {
        return {
          functionData: JSON.stringify(v),
          logId: new Date(v.executedTimestamp).getTime(),
        }
      })
      this.signers[layerOneChainId].sendTransactions(txs)
    }
    await insertProcessedLogs(rows)
    const latestTimestamp = Math.max(
      ...rows.map((v) => new Date(v.executedTimestamp).getTime())
    )
    this.updateTimestamp(latestTimestamp)
  }

  async updateTimestamp(timestamp: number) {
    timestamp = Number(timestamp)
    if (Number.isInteger(timestamp) === false) {
      throw new Error(
        `update timestamp fail, timestamp is not a integer, timestamp: ${timestamp}`
      )
    }
    this.timestamp = timestamp
  }

  // Attempt to retrieve the latest executed timestamp from the 'processed_txs' database table.
  // If not available, initiate scanning using predefined constant timestamps.
  async restoreTimestamp() {
    const r = await selectLatestExecutedTimestamp()
    if (r.rows[0] && r.rows[0]?.executed_at) {
      this.updateTimestamp(new Date(r.rows[0].executed_at).getTime())
    } else {
      this.updateTimestamp(new Date(BROKER_STARTED_TIME).getTime())
    }
  }

  async fetchNewFastWithdrawalTxs(timestamp: number) {
    const result = await zklinkRpcClient
      .request('getFastWithdrawTxs', [
        new Date(timestamp).toISOString(),
        POLLING_LOGS_LIMIT,
      ])
      .then((r) => r.result)

    return result
  }

  async watchNewFastWithdrawalTxs() {
    await this.restoreTimestamp()

    while (true) {
      const rows = await this.fetchNewFastWithdrawalTxs(this.timestamp)

      if (rows.length) {
        await this.submitTransactions(rows)
      }
      await sleep(POLLING_LOGS_INTERVAL)
    }
  }
}

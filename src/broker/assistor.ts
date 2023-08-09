import { JsonRpcProvider } from 'ethers'
import { ParallelSigner } from 'parallel-signer'
import {
  BROKER_MAXIMUM_PACK_TX_LIMIT,
  BROKER_SINGER_PRIVATE_KEY,
  BROKER_STARTED_TIME,
  CHAIN_IDS,
  POLLING_LOGS_INTERVAL,
  POLLING_LOGS_LIMIT,
} from '../conf'
import { brokerContracts } from '../conf/chains'
import { selectLatestExecutedTimestamp } from '../db/process'
import { ChainId } from '../types'
import { getBlockConfirmations } from '../utils/blockConfirmations'
import { getChains } from '../utils/chains'
import { sleep } from '../utils/sleep'
import { FastWithdrawTxsResp, groupingRequestParams } from '../utils/withdrawal'
import { zklinkRpcClient } from './client'
import { OrderedRequestStore, populateTransaction } from './parallel'

export class AssistWithdraw {
  private signers: Record<number, ParallelSigner> = {}
  private timestamp: number = BROKER_STARTED_TIME // start log id of fetch new event logs

  async initSigners(enabledChains: ChainId[]) {
    const layer2Chains = getChains()
    const blockConfirmations = getBlockConfirmations()
    for (let k of enabledChains) {
      const { web3Url, layerOneChainId } = layer2Chains.find(
        (v) => Number(v.layerOneChainId) === Number(k)
      )
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

      if (CHAIN_IDS.includes(Number(layerOneChainId)) === false) {
        continue
      }
      const txs = groupedRequests[l2ChainId].map((v) => {
        return {
          functionData: JSON.stringify(v),
          logId: 0,
        }
      })

      this.signers[layerOneChainId].sendTransactions(txs)
    }

    const maxTimestamp = Math.max(...rows.map((v) => v.executedTimestamp))

    this.updateTimestamp(maxTimestamp)
  }

  async updateTimestamp(timestamp: number) {
    this.timestamp = timestamp
  }

  // Attempt to retrieve the latest executed timestamp from the 'processed_txs' database table.
  // If not available, initiate scanning using predefined constant timestamps.
  async restoreTimestamp() {
    const r = await selectLatestExecutedTimestamp()
    if (r) {
      this.updateTimestamp(r)
    } else {
      this.updateTimestamp(BROKER_STARTED_TIME)
    }
  }

  async fetchNewFastWithdrawalTxs(timestamp: number) {
    const result = await zklinkRpcClient
      .request('getFastWithdrawTxs', [timestamp, POLLING_LOGS_LIMIT])
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

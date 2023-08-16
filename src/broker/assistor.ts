import { JsonRpcProvider } from 'ethers'
import { ParallelSigner } from 'parallel-signer'
import {
  BROKER_MAXIMUM_PACK_TX_LIMIT,
  BROKER_SINGER_PRIVATE_KEY,
  BROKER_STARTED_TIME,
  CHAIN_IDS,
  CHECK_RESEND_INTERVAL,
  POLLING_LOGS_INTERVAL,
  POLLING_LOGS_LIMIT
} from '../conf'
import { brokerContracts } from '../conf/chains'
import { selectLatestExecutedTimestamp } from '../db/process'
import { ChainId } from '../types'
import { getBlockConfirmations } from '../utils/blockConfirmations'
import { getChains, getTokenDecimals } from '../utils/chains'
import { sleep } from '../utils/sleep'
import {
  FastWithdrawRow,
  FastWithdrawTxsResp,
  ForcedExitRow,
  groupingRequestParams
} from '../utils/withdrawal'
import { zklinkRpcClient } from './client'
import {
  OrderedRequestStore,
  RequestObject,
  populateTransaction
} from './parallel'
import { recoveryDecimals } from '../utils/encodeData'

export class AssistWithdraw {
  private signers: Record<number, ParallelSigner> = {}
  private timestamp: number = BROKER_STARTED_TIME // start log id of fetch new event logs
  private requestStore = new OrderedRequestStore()
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
          chainId: chainId
        }),
        this.requestStore,
        populateTransaction(chainId, brokerContract),
        {
          requestCountLimit: BROKER_MAXIMUM_PACK_TX_LIMIT,
          confirmations: blockConfirmations[chainId] || 64,
          checkConfirmation: async (txRecpt) => {
            if (txRecpt != null) {
              //decode log
              // find failed request id
              // TODO
              const id = 1
              await this.requestStore.setResendRequest(id)
            }
          }
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

      //TODO should not be discarded
      if (CHAIN_IDS.includes(Number(layerOneChainId)) === false) {
        continue
      }
      const txs = groupedRequests[l2ChainId].map((v) => {
        return {
          functionData: JSON.stringify(v),
          logId: 0
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

  async watchResendTxs() {
    while (true) {
      for (let chainId of CHAIN_IDS) {
        const requests = await this.requestStore.getRequestsResend(chainId)
        if (requests.length == 0) {
          continue
        }
        const objRequests: RequestObject[] = requests.map((v) => {
          return {
            ...v,
            functionData: JSON.parse(v.functionData)
          }
        })

        for (let index = 0; index < objRequests.length; index++) {
          const v = objRequests[index]

          if (v.functionData.tx.type === 'ForcedExit') {
            let forcedExit = v.functionData as ForcedExitRow
            await this.checkBalance(
              v.id,
              forcedExit.tx.exitAmount,
              forcedExit.tx.l1TargetToken,
              chainId
            )
          } else if (v.functionData.tx.type === 'Withdraw') {
            let fastWithdrawRow = v.functionData as FastWithdrawRow
            await this.checkBalance(
              v.id,
              fastWithdrawRow.tx.amount,
              fastWithdrawRow.tx.l1TargetToken,
              chainId
            )
          } else {
            throw new Error(
              'fastwithdraw type should be forcedExit or withdraw'
            )
          }
        }
      }

      await sleep(CHECK_RESEND_INTERVAL)
    }
  }
  async checkBalance(
    requestId: number,
    _amount: string,
    tokenId: number,
    chainId: ChainId
  ) {
    const _recoveryDecimals = (amount) =>
      recoveryDecimals(amount, getTokenDecimals(chainId, tokenId))
    const amount = _recoveryDecimals(BigInt(_amount))

    //TODO check token balance
    await this.requestStore.moveResendRequest(requestId)
  }
}

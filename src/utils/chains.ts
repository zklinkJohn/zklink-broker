import { zklinkRpcClient } from '../broker/client'
import { ChainId, L2ChainId } from '../types'

export interface ChainInfo {
  chainId: L2ChainId
  layerOneChainId: ChainId
  web3Url: string
  gasTokenId: number
}
export interface AccountInfoResp {
  id: number
  address: string
  nonce: number
  pubKeyHash: string
}
let chains: ChainInfo[] = []

export async function fetchChains(): Promise<ChainInfo[]> {
  const response = await zklinkRpcClient.request('getSupportChains', [])

  if (response.error) {
    return Promise.reject(response.error)
  } else {
    chains = response.result
    return chains
  }
}

//only for test
export function __setChainInfo(chain: ChainInfo) {
  chains.push(chain)
}

export async function fetchAccount(address: string): Promise<AccountInfoResp> {
  const result = await zklinkRpcClient
    .request('getAccount', [address])
    .then((r) => r.result)

  return result
}

export function getChains() {
  return chains
}

export function isGasToken(tokenId: number): boolean {
  return chains.some((v) => Number(v.gasTokenId) === Number(tokenId))
}

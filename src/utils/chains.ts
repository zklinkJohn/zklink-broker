import { zklinkRpcClient } from '../broker/client'
import { Address, ChainId, L2ChainId, TokenId } from '../types'

export interface ChainInfo {
  chainId: L2ChainId
  layerOneChainId: ChainId
  web3Url: string
  gasTokenId: number
}
export interface TokenChainInfo {
  chainId: number
  address: Address
  decimals: number
  fastWithdraw: boolean
}
export interface TokenInfo {
  id: TokenId
  symbol: string
  chains: { [chainId: string]: TokenChainInfo }
}
let tokenInfoMap: { [id: string]: TokenInfo } = {} //token_id -> tokenInfo

export interface AccountInfoResp {
  id: number
  address: string
  nonce: number
  pubKeyHash: string
}
let chains: ChainInfo[] = []
const layer1ToLayer2: { [layerOneChainId: string]: L2ChainId } = {}
export async function fetchChains(): Promise<ChainInfo[]> {
  const response = await zklinkRpcClient.request('getSupportChains', [])

  if (response.error) {
    return Promise.reject(response.error)
  }
  chains = response.result
  for (let chainInfo of chains) {
    layer1ToLayer2[chainInfo.layerOneChainId] = chainInfo.chainId
  }
  return chains
}

//only for test
export function __setChainInfo(chain: ChainInfo) {
  chains.push(chain)
}

export async function fetchTokens() {
  const response = await zklinkRpcClient.request('getSupportTokens', [])

  if (response.error) {
    return Promise.reject(response.error)
  }
  tokenInfoMap = response.result
}

export function getTokenDecimals(chainId: ChainId, tokenId: TokenId): number {
  const tokenInfo: TokenInfo = tokenInfoMap[tokenId.toString()]
  const tokenChainInfo = tokenInfo.chains[layer1ToLayer2[chainId].toString()]
  return tokenChainInfo.decimals
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

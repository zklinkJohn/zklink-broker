import { JsonRpcProvider } from 'ethers'
import { ChainId } from '../types'
import {getChains} from "./chains";

const chainsProvider: Record<ChainId, JsonRpcProvider> = {}

export function providerByChainId(chainId: ChainId) {
  chainId = Number(chainId)

  if (chainsProvider[chainId]) {
    return chainsProvider[chainId]
  }

  const chains = getChains()
  const chain = chains.find(v=> Number(v.layerOneChainId) === chainId)
  chainsProvider[chainId] = new JsonRpcProvider(
    chain.web3Url,
    {
      name: String(chainId),
      chainId: chainId,
    },
  )
  return chainsProvider[chainId]
}

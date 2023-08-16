import { CronJob } from 'cron'
import { Address, ChainId } from '../../types'
import { getChains, getTokens, layer2ChainId } from '../../utils/chains'
import { providerByChainId } from '../../utils/providers'
import { Interface } from 'ethers'
import { callMulticall, getMulticallContracts } from '../../utils/multicall'
import { getBrokerContractsByLayer1Id } from '../../conf/chains'

export function isZeroAddress(tokenAddress: Address): boolean {
  if (!tokenAddress) {
    return false
  }
  return '0x0000000000000000000000000000000000000000' === tokenAddress
}

export function isGasAddress(tokenAddress: Address): boolean {
  if (!tokenAddress) {
    return false
  }
  return (
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() ===
    tokenAddress.toLowerCase()
  )
}

type TokenId = number
const balances: Record<
  ChainId,
  {
    [x: TokenId]: bigint
  }
> = {}

export function getAllBalances() {
  return balances
}

export function getBalance(chainId: ChainId, tokenId: TokenId) {
  return balances[chainId][tokenId]
}

export const jobBalances = new CronJob('* * * * *', async function () {
  fetchAllChainBalances()
})

export function fetchAllChainBalances() {
  const chains = getChains()
  chains.forEach(async (chain) => {
    await fetchBalances(chain.layerOneChainId).catch((e) => {
      console.log(`Fetch balances fail, ${chain.layerOneChainId}`)
      console.log(e)
    })
  })
}

export async function fetchBalances(chainId: ChainId) {
  const supportChains = getChains()
  const provider = providerByChainId(chainId)
  const supportTokens = getTokens()
  const multicallAddress = getMulticallContracts()[chainId]

  const erc20Tokens: {
    tokenId: TokenId
    decimals: number
    address: Address
  }[] = []
  for (let i in supportTokens) {
    const l2ChainId = layer2ChainId(chainId)
    const { chains, id } = supportTokens[i]
    if (!chains || !chains[l2ChainId]) {
      // USD token
      continue
    }
    const { address = '', decimals } = chains[l2ChainId]

    if (!address) {
      continue
    }
    if (isGasAddress(address) || isZeroAddress(address)) {
      continue
    }

    erc20Tokens.push({
      tokenId: id,
      decimals,
      address
    })
  }

  const erc20TokenAddresses: Address[] = erc20Tokens.map((v) => v.address)

  const balanceOfAbi = ['function balanceOf(address) view returns (uint256)']
  const iface = new Interface(balanceOfAbi)
  const fragment = iface.getFunction('balanceOf')
  const brokerAddress = getBrokerContractsByLayer1Id(chainId)
  const calldata = iface.encodeFunctionData(fragment, [brokerAddress])
  const calls = erc20TokenAddresses.map(() => calldata)
  const erc20Balances = await callMulticall(
    provider,
    multicallAddress,
    balanceOfAbi,
    'balanceOf',
    erc20TokenAddresses,
    calls
  )

  if (!balances[chainId]) {
    balances[chainId] = {}
  }

  erc20Balances.forEach((balance, index) => {
    const { tokenId } = erc20Tokens[index]
    balances[chainId][tokenId] = balance
  })

  const gasBalance = await provider.getBalance(brokerAddress)
  const chain = supportChains.find((v) => Number(v.layerOneChainId) === chainId)

  balances[chainId][Number(chain.gasTokenId)] = gasBalance
}

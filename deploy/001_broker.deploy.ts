import { DeployFunction } from 'hardhat-deploy/types'
import chains from '../config/chains'

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  getChainId
}) {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()
  const filters = chains.filter(
    (chain) => chain.layerOneChainId === Number(chainId)
  )
  if (filters.length > 0) {
    const chainInfo = filters[0]
    await deploy('BrokerAccepter', {
      from: deployer,
      args: [chainInfo.mainContract, 100],
      log: true
    })
  }
}

func.tags = ['Broker']
export default func

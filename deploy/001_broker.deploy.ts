import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre) {
  const {
    deployments,
    getNamedAccounts,
  } = hre
  const { deploy } = deployments
  const {deployer} = await getNamedAccounts()
  await deploy('BrokerAccept', {
    from: deployer,
    args: ['0xb2743f7c65c544cefb7ac909787ae226f0dc8363', 100],
    log: true
  })
}

func.tags = ['Broker']
export default func

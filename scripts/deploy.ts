import { ethers, network } from 'hardhat'
import logger from '../logger'

async function main() {
  const BrokerAccepter = await ethers.getContractFactory('BrokerAccepter')
  const broker = await BrokerAccepter.deploy(
    '0xb2743f7c65c544cefb7ac909787ae226f0dc8363',
    100
  )
  await broker.waitForDeployment()
  logger.info(
    `broker deployed network: ${
      network.name
    } address: ${await broker.getAddress()} `
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

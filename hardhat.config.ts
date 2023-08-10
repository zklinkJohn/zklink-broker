import dotenv from 'dotenv'
dotenv.config({})

import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import { HardhatUserConfig } from 'hardhat/config'
import 'hardhat-deploy'

import testNetwork from './testnet.config'

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.18',
        settings: {
          viaIR: true,
          optimizer: {
            enabled: true,
            runs: 100
          }
        }
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 800
          }
        }
      }
    ]
  },
  namedAccounts: {
    deployer: process.env.DEVELOPER
  },
  networks: testNetwork,
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN,
      goerli: process.env.ETHERSCAN,
      avalancheFujiTestnet: process.env.ETHERSCAN_AVAX,
      polygonMumbai: process.env.ETHERSCAN_POLYGON,
      arbitrumGoerli: process.env.ETHERSCAN_ARB,
      baseGoerli: process.env.ETHERSCAN_BASE,
      bscTestnet: process.env.ETHERSCAN_BSC
    }
  }
}

export default config

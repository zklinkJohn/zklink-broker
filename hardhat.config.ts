import dotenv from 'dotenv'
dotenv.config({})

import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import { HardhatUserConfig } from 'hardhat/config'

import testNetwork from './testnet.config'

// function getAccounts(): Array<string> {
//   return process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : ['']
// }

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
  networks: testNetwork,
  etherscan: {
    apiKey: process.env.ETHERSCAN
  }
}

export default config

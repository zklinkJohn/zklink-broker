import dotenv from 'dotenv'
dotenv.config({})

import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import { HardhatUserConfig } from 'hardhat/config'
import "hardhat-deploy"

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
    deployer: "0x362403032De25d11F3DbC357e89e3C3713eFd6A7"
  },
  networks: testNetwork,
  etherscan: {
    apiKey: process.env.ETHERSCAN
  }
}

export default config

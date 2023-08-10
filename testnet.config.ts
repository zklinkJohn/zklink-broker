function getAccounts(): Array<string> {
  return process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : ['']
}

export default {
  'avax-testnet': {
    url: 'https://rpc.ankr.com/avalanche_fuji',
    chainId: 43113,
    accounts: getAccounts()
  },
  'testnet-polygon': {
    url: 'https://rpc.ankr.com/polygon_mumbai',
    chainId: 80001,
    accounts: getAccounts()
  },
  'bsc-testnet': {
    url: 'https://bsc-testnet.publicnode.com',
    chainId: 97,
    accounts: getAccounts()
  },
  goerli: {
    url: 'https://rpc.ankr.com/eth_goerli',
    chainId: 5,
    accounts: getAccounts()
  },
  'zksync-era': {
    url: 'https://testnet.era.zksync.dev',
    chainId: 280,
    accounts: getAccounts()
  },
  linea: {
    url: 'https://rpc.goerli.linea.build',
    chainId: 59140,
    accounts: getAccounts()
  },
  'arbitrum-goerli': {
    url: 'https://arbitrum-goerli.publicnode.com',
    chainId: 421613,
    accounts: getAccounts()
  },
  'optimism-goerli-testnet': {
    url: 'https://optimism-goerli.publicnode.com',
    chainId: 420,
    accounts: getAccounts()
  },
  'base-goerli': {
    url: 'https://1rpc.io/base-goerli',
    chainId: 84531,
    accounts: getAccounts()
  },
  'mantle-testnet': {
    url: 'https://rpc.testnet.mantle.xyz',
    chainId: 5001,
    accounts: getAccounts()
  },
  'manta-pacific-testnet': {
    url: 'https://manta-testnet.calderachain.xyz/http',
    chainId: 3441005,
    accounts: getAccounts()
  }
}

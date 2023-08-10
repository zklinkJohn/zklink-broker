function getAccounts(): Array<string> {
  return process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : ['']
}

export default {
  'avax-testnet': {
    url: 'https://rpc.ankr.com/avalanche_fuji',
    chainId: 43113,
    accounts: getAccounts()
  },
  'polygon-testnet': {
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
  'zksync-era-testnet': {
    url: 'https://testnet.era.zksync.dev',
    chainId: 280,
    accounts: getAccounts()
  },
  'linea-testnet': {
    url: 'https://rpc.goerli.linea.build',
    chainId: 59140,
    accounts: getAccounts()
  },
  'arbitrum-testnet': {
    url: 'https://arbitrum-goerli.publicnode.com',
    chainId: 421613,
    accounts: getAccounts()
  },
  'optimism-testnet': {
    url: 'https://optimism-goerli.publicnode.com',
    chainId: 420,
    accounts: getAccounts()
  },
  'base-testnet': {
    url: 'https://base-goerli.public.blastapi.io',
    chainId: 84531,
    accounts: getAccounts()
  },
  'mantle-testnet': {
    url: 'https://rpc.testnet.mantle.xyz',
    chainId: 5001,
    accounts: getAccounts()
  },
  'manta-testnet': {
    url: 'https://manta-testnet.calderachain.xyz/http',
    chainId: 3441005,
    accounts: getAccounts()
  }
}

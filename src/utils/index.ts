import { Interface } from 'ethers'
import { abi as BrokerAccepter } from '../abi/BrokerAccepter.json'
import { abi as ZkLinkAbi } from '../abi/ZkLink.json'

export const ZKLINK_INTERFACE = new Interface(ZkLinkAbi)
export const BROKER_ACCEPTER_INTERFACE = new Interface(BrokerAccepter)

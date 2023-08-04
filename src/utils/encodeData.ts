import { Interface } from 'ethers'
import { BROKER_ACCEPTER_INTERFACE, ZKLINK_INTERFACE } from '.'

export function encodeData(iface: Interface, funName: string, args: any[]) {
  const fragment = iface.getFunction(funName)
  return iface.encodeFunctionData(fragment, args)
}

export function encodeAcceptERC20(args: any[]) {
  return encodeData(ZKLINK_INTERFACE, 'acceptERC20', args)
}

export function encodeAcceptETH(args: any[]) {
  return encodeData(ZKLINK_INTERFACE, 'acceptETH', args)
}

export function encodeBatchAccept(args: any[]) {
  return encodeData(BROKER_ACCEPTER_INTERFACE, 'batchAccept', args)
}

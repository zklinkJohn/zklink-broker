import { watcherServerClient } from '../broker/client'
import { ChainId } from '../types'

export type GetBlockConfirmationsResult = Record<ChainId, number>
export async function fetchBlockConfirmations(): Promise<GetBlockConfirmationsResult> {
  return watcherServerClient
    .request('watcher_getBlockConfirmations', [])
    .then((r) => r.result)
}

export let blockConfirmations: GetBlockConfirmationsResult
export async function initBlockConfirmations() {
  blockConfirmations = await fetchBlockConfirmations()
}
export function getBlockConfirmations() {
  return blockConfirmations
}

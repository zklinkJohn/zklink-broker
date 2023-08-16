import { jobBalances } from './balances'

export async function jobs() {
  jobBalances.fireOnTick()
  jobBalances.start()
}

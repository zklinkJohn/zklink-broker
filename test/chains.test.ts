import dotenv from 'dotenv'
dotenv.config({ path: `.env.devnet`, override: true })
dotenv.config({ path: `.env.devnet.local`, override: true })
import { fetchTokens } from '../src/utils/chains'

describe('chains.ts', function () {
  beforeEach(async function () {})
  it('fetch tokens should be ok', async function () {
    await fetchTokens()
  })
})

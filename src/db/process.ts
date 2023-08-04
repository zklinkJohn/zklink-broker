import { pool } from '.'
import { FastWithdrawTxsResp } from '../utils/withdrawal'

export async function insertProcessedLogs(rows: FastWithdrawTxsResp[]) {
  if (!rows?.length) return

  for (let log of rows) {
    await pool.query(
      `
        INSERT INTO processed_txs (hash, tx, executed_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (hash) DO NOTHING
      `,
      [log.txHash, log.tx, new Date(log.executedTimestamp).getTime()]
    )
  }
}

export async function selectLatestExecutedTimestamp() {
  return await pool.query(`
    SELECT executed_at AS "executedAt"
    FROM processed_txs
    ORDER BY id DESC
    LIMIT 1;
  `)
}

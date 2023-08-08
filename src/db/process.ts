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
  const r = await pool.query(`
    SELECT function_data AS "functionData"
    FROM requests
    ORDER BY id DESC
    LIMIT 1;
  `)

  if (r.rows[0] && r.rows[0].functionData) {
    const data = JSON.parse(r.rows[0].functionData)
    return data.executedTimestamp
  } else {
    return null
  }
}

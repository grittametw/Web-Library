import { Pool, PoolConfig } from 'pg'

export const dbConfig: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  ssl: process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED === 'false' 
    ? false 
    : { rejectUnauthorized: true },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

let pool: Pool

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(dbConfig)
  }
  return pool
}
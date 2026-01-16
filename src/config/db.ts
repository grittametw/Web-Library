import { Pool, PoolConfig } from 'pg'

let pool: Pool

export function getPool(): Pool {
  if (!pool) {
    const isProd = !!process.env.POSTGRES_URL_NON_POOLING

    const dbConfig: PoolConfig = isProd
      ? {
          connectionString: process.env.POSTGRES_URL_NON_POOLING,
          ssl: { rejectUnauthorized: false },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        }
      : {
          host: process.env.POSTGRES_HOST || 'localhost',
          user: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || 'postgres',
          database: process.env.POSTGRES_DATABASE || 'postgres',
          port: Number(process.env.POSTGRES_PORT) || 54322,
          ssl: false,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        }

    pool = new Pool(dbConfig)
  }

  return pool
}
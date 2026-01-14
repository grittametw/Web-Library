import { Pool, PoolConfig } from 'pg'

let pool: Pool

export function getPool(): Pool {
  if (!pool) {
    const isProd = process.env.NODE_ENV === 'production'

    const dbConfig: PoolConfig = isProd
      ? {
        connectionString:
          process.env.POSTGRES_URL_NON_POOLING ||
          process.env.POSTGRES_URL ||
          process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
      : {
        host: process.env.POSTGRES_HOST || 'localhost',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DATABASE || 'postgres',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        ssl: false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }

    pool = new Pool(dbConfig)
  }

  return pool
}
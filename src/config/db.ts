import { Pool, PoolConfig } from 'pg'

let pool: Pool

export function getPool(): Pool {
  if (!pool) {
    const hasConnectionString = !!process.env.POSTGRESQL_URL_NON_POOLING
    const isProduction = process.env.NODE_ENV === 'production'

    const dbConfig: PoolConfig = hasConnectionString
      ? {
          connectionString: process.env.POSTGRESQL_URL_NON_POOLING,
          ssl: isProduction 
            ? { rejectUnauthorized: true }
            : { rejectUnauthorized: false },
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
import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { createLogger } from './logger';

const dbLocalLogger = createLogger('DB_LOCAL');

// Singleton pool instance for local database
let localPool: Pool | null = null;

const localPoolConfig: PoolOptions = {
  host: process.env.LOCAL_DB_HOST || 'localhost',
  user: process.env.LOCAL_DB_USER || 'root',
  password: process.env.LOCAL_DB_PASSWORD || '',
  database: process.env.LOCAL_DB_NAME || 'randevu_db',

  // Connection pool settings
  connectionLimit: 5,
  waitForConnections: true,
  queueLimit: 0,

  // Keep connections alive
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,

  // Timeouts
  connectTimeout: 10000,

  // Timezone
  timezone: '+03:00', // Turkey timezone
};

/**
 * Get or create the local database connection pool
 */
export function getLocalPool(): Pool {
  if (!localPool) {
    localPool = mysql.createPool(localPoolConfig);
    dbLocalLogger.info('Local database connection pool created');
  }
  return localPool;
}

/**
 * Execute a query on local database
 */
export async function queryLocal<T>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  const pool = getLocalPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

/**
 * Execute a query and return first row only
 */
export async function queryOneLocal<T>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await queryLocal<T[]>(sql, params);
  return rows[0] || null;
}

/**
 * Execute an insert and return insert ID
 */
export async function insertLocal(
  sql: string,
  params?: unknown[]
): Promise<number> {
  const pool = getLocalPool();
  const [result] = await pool.execute(sql, params);
  return (result as mysql.ResultSetHeader).insertId;
}

/**
 * Execute an update/delete and return affected rows
 */
export async function executeLocal(
  sql: string,
  params?: unknown[]
): Promise<number> {
  const pool = getLocalPool();
  const [result] = await pool.execute(sql, params);
  return (result as mysql.ResultSetHeader).affectedRows;
}

/**
 * Check local database connectivity
 */
export async function healthCheckLocal(): Promise<boolean> {
  try {
    const pool = getLocalPool();
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    dbLocalLogger.error({ error }, 'Local database health check failed');
    return false;
  }
}

/**
 * Gracefully close the local pool
 */
export async function closeLocalPool(): Promise<void> {
  if (localPool) {
    await localPool.end();
    localPool = null;
    dbLocalLogger.info('Local database connection pool closed');
  }
}

export default {
  getLocalPool,
  queryLocal,
  queryOneLocal,
  insertLocal,
  executeLocal,
  healthCheckLocal,
  closeLocalPool
};

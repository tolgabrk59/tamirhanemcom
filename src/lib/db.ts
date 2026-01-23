import mysql, { Pool, PoolOptions } from 'mysql2/promise';
import { createLogger } from './logger';

const dbLogger = createLogger('DATABASE');

// Singleton pool instance
let pool: Pool | null = null;

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Connection pool settings
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
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
 * Get or create the database connection pool
 * Uses singleton pattern to ensure only one pool exists
 */
export function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool(poolConfig);

    // Log pool creation
    dbLogger.info('Database connection pool created');

    // Handle pool errors
    pool.on('connection', (connection) => {
      dbLogger.debug('New database connection established');

      connection.on('error', (err) => {
        dbLogger.error({ err: err.message }, 'Database connection error');
      });
    });
  }

  return pool;
}

/**
 * Execute a query using the connection pool
 * Automatically handles connection acquisition and release
 */
export async function query<T>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
}

/**
 * Execute a query and return first row only
 */
export async function queryOne<T>(
  sql: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T[]>(sql, params);
  return rows[0] || null;
}

/**
 * Execute an insert and return insert ID
 */
export async function insert(
  sql: string,
  params?: unknown[]
): Promise<number> {
  const pool = getPool();
  const [result] = await pool.execute(sql, params);
  return (result as mysql.ResultSetHeader).insertId;
}

/**
 * Execute an update/delete and return affected rows
 */
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<number> {
  const pool = getPool();
  const [result] = await pool.execute(sql, params);
  return (result as mysql.ResultSetHeader).affectedRows;
}

/**
 * Run multiple queries in a transaction
 */
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Check database connectivity
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    dbLogger.error({ error }, 'Database health check failed');
    return false;
  }
}

/**
 * Gracefully close the pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    dbLogger.info('Database connection pool closed');
  }
}

// Graceful shutdown handlers
if (typeof process !== 'undefined') {
  const shutdown = async () => {
    dbLogger.info('Shutting down database pool...');
    await closePool();
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

export default { getPool, query, queryOne, insert, execute, transaction, healthCheck, closePool };

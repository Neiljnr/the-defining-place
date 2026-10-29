// ===================================================================
// Vercel Serverless Database Connection Helper
// Supports PostgreSQL (Neon, Vercel Postgres, Supabase)
// ===================================================================

let pool = null;

export async function getDbPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return null;
  }

  try {
    const { default: pg } = await import('pg');
    const { Pool } = pg;
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
    return pool;
  } catch (err) {
    console.warn('[DB] PostgreSQL driver not loaded or connection failed:', err.message);
    return null;
  }
}

export async function queryDb(text, params = []) {
  const dbPool = await getDbPool();
  if (!dbPool) {
    return { rows: [], error: 'NO_DATABASE_URL' };
  }
  const client = await dbPool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

// ===================================================================
// Neon Serverless Database Connection Helper
// Uses @neondatabase/serverless for optimal performance in Serverless/Vercel
// ===================================================================

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load .env.local or .env if in local/node environment
if (!process.env.DATABASE_URL) {
  try {
    dotenv.config({ path: '.env.local' });
    if (!process.env.DATABASE_URL) {
      dotenv.config({ path: '.env' });
    }
  } catch {}
}

let sqlClient = null;

export function getNeonSql() {
  const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL;
  if (!connectionString) {
    return null;
  }
  if (!sqlClient) {
    sqlClient = neon(connectionString);
  }
  return sqlClient;
}

export async function queryDb(text, params = []) {
  const sql = getNeonSql();
  if (!sql) {
    console.warn('[Neon DB] No DATABASE_URL found in environment.');
    return { rows: [], error: 'NO_DATABASE_URL' };
  }

  try {
    // Official Neon serverless query function: returns array of rows directly
    const result = await sql.query(text, params || []);
    const rows = Array.isArray(result) ? result : (result?.rows || []);
    return {
      rows,
      rowCount: rows.length
    };
  } catch (error) {
    console.error('[Neon DB Error]:', error.message);
    throw error;
  }
}

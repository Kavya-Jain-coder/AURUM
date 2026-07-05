/**
 * NeonDB + Drizzle ORM Connection
 *
 * Uses @neondatabase/serverless for HTTP-based queries (ideal for serverless/edge).
 * Falls back gracefully when DATABASE_URL is not set (demo mode).
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const rawUrl = process.env.DATABASE_URL;
const databaseUrl = rawUrl && !rawUrl.includes('your-neon-host.neon.tech') ? rawUrl : null;

// Create a neon SQL function — this is the HTTP-based query client
const sql = databaseUrl
  ? neon(databaseUrl, { fetchOptions: { cache: 'no-store' } })
  : null;

// Create Drizzle ORM instance
export const db = sql
  ? drizzle(sql, { schema })
  : null;

// Helper to check if DB is connected
export function isDatabaseConnected(): boolean {
  return db !== null;
}

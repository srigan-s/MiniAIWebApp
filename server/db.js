import fs from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dataDirectory = path.resolve(process.cwd(), 'server', 'data');
const databasePath = path.join(dataDirectory, 'miniai.db');
const databaseUrl = process.env.DATABASE_URL;

let databasePromise;

const sharedSchema = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar TEXT NOT NULL,
    parental_consent INTEGER NOT NULL DEFAULT 0,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    badges_json TEXT NOT NULL DEFAULT '[]',
    completed_lessons_json TEXT NOT NULL DEFAULT '[]',
    completed_games_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL
  );
`;

const shouldUseSsl = () => {
  if (!databaseUrl) {
    return false;
  }

  if (process.env.PGSSLMODE === 'disable') {
    return false;
  }

  return !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1');
};

const createSqliteConnection = async () => {
  await fs.mkdir(dataDirectory, { recursive: true });
  const sqliteDb = await open({
    filename: databasePath,
    driver: sqlite3.Database,
  });
  await sqliteDb.exec(sharedSchema);

  return {
    kind: 'sqlite',
    client: sqliteDb,
  };
};

const createPostgresConnection = async () => {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: shouldUseSsl() ? { rejectUnauthorized: false } : undefined,
  });

  await pool.query(sharedSchema);

  return {
    kind: 'postgres',
    client: pool,
  };
};

export const getDb = async () => {
  if (!databasePromise) {
    databasePromise = (async () => {
      if (databaseUrl) {
        return createPostgresConnection();
      }

      return createSqliteConnection();
    })();
  }

  return databasePromise;
};

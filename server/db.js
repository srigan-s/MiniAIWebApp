import fs from 'node:fs/promises';
import path from 'node:path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dataDirectory = path.resolve(process.cwd(), 'server', 'data');
const databasePath = path.join(dataDirectory, 'miniai.db');

let databasePromise;

const createSchema = async (db) => {
  await db.exec(`
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
  `);
};

export const getDb = async () => {
  if (!databasePromise) {
    databasePromise = (async () => {
      await fs.mkdir(dataDirectory, { recursive: true });
      const db = await open({
        filename: databasePath,
        driver: sqlite3.Database,
      });
      await createSchema(db);
      return db;
    })();
  }

  return databasePromise;
};

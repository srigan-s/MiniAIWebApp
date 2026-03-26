import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';

const mapUserRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    age: row.age,
    email: row.email,
    avatar: row.avatar,
    parentalConsent: Boolean(row.parental_consent),
    xp: row.xp,
    level: row.level,
    badges: JSON.parse(row.badges_json),
    completedLessons: JSON.parse(row.completed_lessons_json),
    completedGames: JSON.parse(row.completed_games_json),
    createdAt: row.created_at,
  };
};

const serializeUserProgress = (user) => ({
  xp: user.xp,
  level: user.level,
  badges_json: JSON.stringify(user.badges ?? []),
  completed_lessons_json: JSON.stringify(user.completedLessons ?? []),
  completed_games_json: JSON.stringify(user.completedGames ?? []),
});

export const findUserByEmail = async (email) => {
  const db = await getDb();
  const row = await db.get('SELECT * FROM users WHERE email = ?', email.toLowerCase());
  return row;
};

export const findUserById = async (id) => {
  const db = await getDb();
  const row = await db.get('SELECT * FROM users WHERE id = ?', id);
  return mapUserRow(row);
};

export const createUser = async ({ name, age, email, password, avatar, parentalConsent }) => {
  const db = await getDb();
  const id = crypto.randomUUID();
  const normalizedEmail = email.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);
  const createdAt = new Date().toISOString();

  await db.run(
    `INSERT INTO users (
      id,
      name,
      age,
      email,
      password_hash,
      avatar,
      parental_consent,
      xp,
      level,
      badges_json,
      completed_lessons_json,
      completed_games_json,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1, '[]', '[]', '[]', ?)`,
    id,
    name,
    age,
    normalizedEmail,
    passwordHash,
    avatar,
    parentalConsent ? 1 : 0,
    createdAt
  );

  return {
    id,
    name,
    age,
    email: normalizedEmail,
    avatar,
    parentalConsent,
    xp: 0,
    level: 1,
    badges: [],
    completedLessons: [],
    completedGames: [],
    createdAt,
  };
};

export const verifyUserCredentials = async (email, password) => {
  const row = await findUserByEmail(email);

  if (!row) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, row.password_hash);
  if (!isMatch) {
    return null;
  }

  return mapUserRow(row);
};

export const updateUserProgress = async (id, progress) => {
  const db = await getDb();
  const existingUser = await findUserById(id);

  if (!existingUser) {
    return null;
  }

  const updatedUser = {
    ...existingUser,
    xp: progress.xp,
    level: progress.level,
    badges: progress.badges,
    completedLessons: progress.completedLessons,
    completedGames: progress.completedGames,
  };

  const serializedProgress = serializeUserProgress(updatedUser);

  await db.run(
    `UPDATE users
     SET xp = ?,
         level = ?,
         badges_json = ?,
         completed_lessons_json = ?,
         completed_games_json = ?
     WHERE id = ?`,
    serializedProgress.xp,
    serializedProgress.level,
    serializedProgress.badges_json,
    serializedProgress.completed_lessons_json,
    serializedProgress.completed_games_json,
    id
  );

  return updatedUser;
};

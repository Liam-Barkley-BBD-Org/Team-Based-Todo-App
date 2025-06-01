import { db } from '../db/knex.js';

const TABLE_NAME = 'users';

export async function getUserByEmail(email) {
  return await db(TABLE_NAME).where({ email }).first();
}

export async function createUser({ email, username, password_hash, encrypted_2fa_secret }) {
  const [user] = await db(TABLE_NAME)
    .insert({ email, username, password_hash, encrypted_2fa_secret })
    .returning(['id', 'username']);
  return user;
}
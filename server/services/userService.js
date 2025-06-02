import { db } from '../db/knex.js';

const TABLE_NAME = 'users';

export async function getUserById(id) {
  return await db(TABLE_NAME).where({ id }).first().select('id', 'email', 'username');
}

export async function getUserByEmail(email) {
  return await db(TABLE_NAME).where({ email }).first().select('id', 'email', 'username');
}

export async function createUser({ email, username, password_hash, encrypted_2fa_secret }) {
  const [user] = await db(TABLE_NAME)
    .insert({ email, username, password_hash, encrypted_2fa_secret })
    .returning(['id', 'email', 'username']);
  return user;
}
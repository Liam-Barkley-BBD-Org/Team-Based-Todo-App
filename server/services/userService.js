import { db } from '../db/knex.js';

const TABLE_NAME = 'users';

export async function getUserById(id) {
  return await db(TABLE_NAME).where({ id }).first().select('id', 'username');
}

export async function getUserByUsername(username) {
  return await db(TABLE_NAME).where({ username }).first().select('id', 'username');
}

export async function createUser({ username, password_hash, encrypted_2fa_secret }) {
  const [user] = await db(TABLE_NAME)
    .insert({ username, password_hash, encrypted_2fa_secret })
    .returning(['id', 'username']);
  return user;
}
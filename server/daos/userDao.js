import { db } from "../db/knex.js";

const TABLE_NAME = "users";

export async function getUserById(id) {
  return await db(TABLE_NAME).where({ id }).first().select("id", "username");
}

export async function getUserByUsername(username) {
  return await db(TABLE_NAME)
    .where({ username })
    .first()
    .select("id", "username");
}

export async function createUser({ username, hashed_password }) {
  const [user] = await db(TABLE_NAME)
    .insert({ username, hashed_password })
    .returning(["id", "username"]);
  return user;
}

export async function updateUser2FASecret(userId, encrypted_2fa_secret) {
  return await db(TABLE_NAME)
    .where({ id: userId })
    .update({ encrypted_2fa_secret });
}

export async function getUserAuthDetailsById(id) {
  return await db(TABLE_NAME)
    .where({ id })
    .first()
    .select("id", "username", "hashed_password", "encrypted_2fa_secret");
}

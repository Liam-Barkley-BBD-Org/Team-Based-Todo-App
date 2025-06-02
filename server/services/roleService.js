import { db } from '../db/knex.js';

const TABLE_NAME = 'roles';

export async function getAllRoles() {
  return await db(TABLE_NAME);
}

export async function getRoleById(id) {
  return await db(TABLE_NAME).where({ id }).first();
}
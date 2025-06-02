import { db } from '../db/knex.js';

const TABLE_NAME = 'user_roles';

export async function getUserRoleById(id) {
  return await db(TABLE_NAME).where({ id }).first();
}

export async function getUserRolesByUserId(user_id) {
  return await db(TABLE_NAME).where({ user_id }).select('id', 'role_id');
}

export async function getUserRoleByUserIdAndRoleId(user_id, role_id) {
  return await db(TABLE_NAME).where({ user_id, role_id }).first();
}

export async function createUserRole({ user_id, role_id }) {
  const [userRole] = await db(TABLE_NAME)
    .insert({ user_id, role_id })
    .returning(['id', 'role_id', 'user_id']);
  return userRole;
}

export async function removeUserRole({ id }) {
  const [deletedUserRole] = await db(TABLE_NAME)
    .where({ id })
    .delete()
    .returning(['id', 'user_id', 'role_id']);
  return deletedUserRole;
}
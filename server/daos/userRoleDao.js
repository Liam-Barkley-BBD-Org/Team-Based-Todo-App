import { db } from '../db/knex.js';

const TABLE_NAME = 'user_roles';

export async function getUserRoleById(id) {
  return await db(TABLE_NAME).where({ id }).first();
}

export async function getUserRolesByUserId(user_id) {
  return await db('user_roles')
    .join('roles', 'user_roles.role_id', 'roles.id')
    .where('user_roles.user_id', user_id)
    .select('roles.id as role_id', 'roles.name as role_name');
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
import { db } from '../db/knex.js';

const TABLE_NAME = 'todos';

export async function getTodoById(id) {
  return await db(TABLE_NAME)
    .where({ id })
    .whereNull('deleted_at')
    .first();
}

export async function getTodosByTeamId(team_id) {
  return await db(TABLE_NAME)
    .where({ team_id })
    .whereNull('deleted_at');
}

export async function getAllTodosByUserId(user_id) {
  return await db(TABLE_NAME)
    .where(builder =>
      builder.where('created_by_user_id', user_id).orWhere('assigned_user_id', user_id)
    )
    .whereNull('deleted_at');
}

export async function getOwnedTodosByUserId(created_by_user_id) {
  return await db(TABLE_NAME).where({ created_by_user_id }).whereNull('deleted_at');
}

export async function getAssignedTodosByUserId(assigned_user_id) {
  return await db(TABLE_NAME).where({ assigned_user_id }).whereNull('deleted_at');
}

export async function createTodo({ title, description, created_at, created_by_user_id, team_id, is_open, assigned_user_id }) {
  const [todo] = await db(TABLE_NAME)
    .insert({ title, description, created_at, created_by_user_id, team_id, is_open, assigned_user_id })
    .returning(['id', 'title', 'description', 'created_at', 'created_by_user_id', 'team_id', 'is_open', 'assigned_user_id']);
  return todo;
}

export async function updateTodo(id, fields) {
  const [updated] = await db(TABLE_NAME)
    .where({ id })
    .update(fields)
    .returning(['id', 'title', 'description', 'created_at', 'created_by_user_id', 'team_id', 'is_open', 'assigned_user_id']);
  return updated;
}

export async function softDeleteTodo(id) {
  const [deleted] = await db(TABLE_NAME)
    .where({ id })
    .update({ deleted_at: new Date().toISOString() })
    .returning(['id', 'title', 'deleted_at']);
  return deleted;
}
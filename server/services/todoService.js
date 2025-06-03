import { db } from '../db/knex.js';

const TABLE_NAME = 'todos';

export async function getTodoById(id) {
  return await db(TABLE_NAME).where({ id }).first();
}

export async function getTodosByTeamId(team_id) {
  return await db(TABLE_NAME).where({ team_id });
}

export async function getAllTodosByUserId(user_id) {
  return await db(TABLE_NAME).where('created_by_user_id', user_id).orWhere('assigned_user_id', user_id);
}

export async function getOwnedTodosByUserId(created_by_user_id) {
  return await db(TABLE_NAME).where({ created_by_user_id });
}

export async function getAssignedTodosByUserId(assigned_user_id) {
  return await db(TABLE_NAME).where({ assigned_user_id });
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

import { db } from '../db/knex.js';

const TABLE_NAME = 'todo_snapshots';

export async function createTodoSnapshot({ todo_id, snapshot_at, is_open, assigned_user_id }) {
  const [todo] = await db(TABLE_NAME)
    .insert({ todo_id, snapshot_at, is_open, assigned_user_id })
    .returning(['id', 'todo_id', 'snapshot_at', 'is_open', 'assigned_user_id']);
  return todo;
}
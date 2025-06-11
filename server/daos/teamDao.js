import { db } from '../db/knex.js';

const TABLE_NAME = 'teams';

export async function getTeamById(id) {
  return await db(TABLE_NAME).where({ id }).first();
}

export async function getTeamByName(name) {
  return await db(TABLE_NAME).where({ name }).first();
}

export async function getTeamsByOwnerId(owner_user_id) {
  return await db(TABLE_NAME).where({ owner_user_id });
}

export async function createTeam({ name, owner_user_id }) {
  const [team] = await db(TABLE_NAME)
    .insert({ name, owner_user_id })
    .returning(['id', 'name', 'owner_user_id']);
  return team;
}
import { db } from '../db/knex.js';

const TABLE_NAME = 'team_members';

export async function getTeamMemberById(id) {
  return await db(TABLE_NAME).where({ id }).first();
}

export async function getMembersByTeamId(team_id) {
  return await db(TABLE_NAME).where({ team_id });
}

export async function getTeamMemberByTeamIdAndUserId({ team_id, user_id }) {
  return await db(TABLE_NAME).where({ team_id, user_id }).first();
}

export async function getTeamsByUserId(user_id) {
  return await db(TABLE_NAME).where({ user_id });
}

export async function createTeamMember({ team_id, user_id }) {
  const [teamMember] = await db(TABLE_NAME)
    .insert({ team_id, user_id })
    .returning(['id', 'team_id', 'user_id']);
  return teamMember;
}

export async function removeTeamMember(id) {
  const [teamMember] = await db(TABLE_NAME)
    .where({ id })
    .delete()
    .returning(['id', 'team_id', 'user_id']);
  return teamMember;
}
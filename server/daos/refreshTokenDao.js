import { db } from '../db/knex.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const TABLE_NAME = 'refresh_tokens';

function generateTokenString() {
  return crypto.randomBytes(48).toString('hex');
}

export async function createRefreshToken({ userId, expires }) {
  const token = generateTokenString();
  const hashed_token = await bcrypt.hash(token, 12);
  await db(TABLE_NAME).insert({
    user_id: userId,
    hashed_token,
    expiry_date: new Date(expires),
    is_revoked: false,
  });
  return token;
}

export async function getRefreshToken(token) {
  const tokens = await db(TABLE_NAME).where({ is_revoked: false });
  for (const entry of tokens) {
    if (await bcrypt.compare(token, entry.hashed_token)) {
      return {
        id: entry.id,
        userId: entry.user_id,
        expires: new Date(entry.expiry_date).getTime(),
        revoked: entry.is_revoked,
      };
    }
  }
  return null;
}

export async function revokeRefreshToken(token) {
  const tokens = await db(TABLE_NAME).where({ is_revoked: false });
  for (const entry of tokens) {
    if (await bcrypt.compare(token, entry.hashed_token)) {
      await db(TABLE_NAME).where({ id: entry.id }).update({ is_revoked: true });
      break;
    }
  }
}

export async function rotateRefreshToken(oldToken, { userId, expires }) {
  await revokeRefreshToken(oldToken);
  return createRefreshToken({ userId, expires });
}

export async function isRefreshTokenValid(token) {
  const entry = await getRefreshToken(token);
  if (!entry) return false;
  if (entry.revoked) return false;
  if (entry.expires < Date.now()) return false;
  return true;
}

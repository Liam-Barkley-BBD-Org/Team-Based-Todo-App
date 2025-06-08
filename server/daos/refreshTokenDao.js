import { db } from "../db/knex.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const TABLE_NAME = "refresh_tokens";

function generateTokenString() {
  return crypto.randomBytes(48).toString("hex");
}

export async function createRefreshToken({ userId, expires }) {
  const token = generateTokenString();
  const hashed_token = await bcrypt.hash(token, 12);
  const [row] = await db(TABLE_NAME)
    .insert({
      user_id: userId,
      hashed_token,
      expiry_date: new Date(expires),
      is_revoked: false,
    })
    .returning(["id"]);
  const id = row.id;
  const fullToken = `${id}.${token}`;
  return fullToken;
}

export async function getRefreshToken(fullToken) {
  let result = null;
  if (fullToken && fullToken.includes(".")) {
    const [id, token] = fullToken.split(".");
    const refreshTokenRecord = await db(TABLE_NAME).where({ id, is_revoked: false }).first();
    if (refreshTokenRecord) {
      const match = await bcrypt.compare(token, refreshTokenRecord.hashed_token);
      if (match) {
        result = {
          id: refreshTokenRecord.id,
          userId: refreshTokenRecord.user_id,
          expires: new Date(refreshTokenRecord.expiry_date).getTime(),
          revoked: refreshTokenRecord.is_revoked,
        };
      }
    }
  }
  return result;
}

export async function revokeRefreshToken(fullToken) {
  if (fullToken && fullToken.includes(".")) {
    const [id, token] = fullToken.split(".");
    const refreshTokenRecord = await db(TABLE_NAME).where({ id, is_revoked: false }).first();
    if (refreshTokenRecord) {
      const match = await bcrypt.compare(token, refreshTokenRecord.hashed_token);
      if (match) {
        await db(TABLE_NAME).where({ id }).update({ is_revoked: true });
      }
    }
  }
}

export async function isRefreshTokenValid(token) {
  let valid = false;
  const refreshTokenRecord = await getRefreshToken(token);
  if (refreshTokenRecord && !refreshTokenRecord.revoked && refreshTokenRecord.expires >= Date.now()) {
    valid = true;
  }
  return valid;
}

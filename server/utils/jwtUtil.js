import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "superjwtsecret";
const JWT_EXPIRES_IN = "15m";

export function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

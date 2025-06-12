import jwt from "jsonwebtoken";
import { JWTSecret } from "./awsSecretManager";

const JWT_SECRET = JWTSecret.jwtSecret;
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

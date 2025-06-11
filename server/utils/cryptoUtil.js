import crypto from "crypto";
import dotenv from "dotenv";
import { AESKeySecret } from "./awsSecretManager.js";
dotenv.config();

const algorithm = "aes-256-gcm";
const key = Buffer.from(AESKeySecret.key, "base64").slice(0, 32);

export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decrypt(encryptedBase64) {
  const data = Buffer.from(encryptedBase64, "base64");
  const iv = Uint8Array.prototype.slice.call(data, 0, 12);
  const authTag = Uint8Array.prototype.slice.call(data, 12, 28);
  const encryptedText = Uint8Array.prototype.slice.call(data, 28);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

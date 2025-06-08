import crypto from "crypto";
import dotenv from "dotenv";
import { AESKeySecret } from "./awsSecretManager.js";
dotenv.config();

const algorithm = AESKeySecret.algorithm || "aes-256-cbc";
const key = Buffer.from(AESKeySecret.key, "base64");
const iv = Buffer.from("1111", "base64");

export function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

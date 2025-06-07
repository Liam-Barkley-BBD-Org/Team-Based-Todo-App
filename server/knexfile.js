import dotenv from 'dotenv';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secret_name = "CdkTodoAppStacktodoapppostg";

const client = new SecretsManagerClient({
  region: "us-east-1",
});

let response;
try {
  response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
    })
  );
} catch (error) {
  console.error('Failed getting secrets')
  throw error;
}
const secret = response

dotenv.config();

export default {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
  },
};
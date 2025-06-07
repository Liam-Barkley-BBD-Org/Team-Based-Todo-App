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
const DBsecret = JSON.parse(response.SecretString)

dotenv.config();

export default {
  development: {
    client: 'pg',
    connection: {
      host: DBsecret.host,
      port: Number(DBsecret.port),
      database: DBsecret.dbname,
      user: DBsecret.username,
      password: DBsecret.password,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  },
};
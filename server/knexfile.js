import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

//HOMIES PUT YOUR CUSTOM DB CONNECTIONS HERE
let knexEnv = {
  client: 'pg',
  connection: {
    host: 'hostname',
    port: 1234,
    database: 'dname',
    user: 'duser',
    password: 'dpassword',
  }
}

if (process.env.NODE_ENV == 'production') {
  let response;
  const secret_name = "CdkTodoAppStacktodoapppostg";
  const client = new SecretsManagerClient({
    region: "us-east-1",
  });

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
  knexEnv = {
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
    migrations: {
      directory: './migrations',
      extension: 'js',
    }
  }
}

export default knexEnv
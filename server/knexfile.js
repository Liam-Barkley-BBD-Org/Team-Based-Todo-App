import { DBSecret } from "./utils/awsSecretManager.js"

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
  knexEnv = {
    client: 'pg',
    connection: {
      host: DBSecret.host,
      port: Number(DBSecret.port),
      database: DBSecret.dbname,
      user: DBSecret.username,
      password: DBSecret.password,
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
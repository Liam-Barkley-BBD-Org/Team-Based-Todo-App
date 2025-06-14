import dotenv from 'dotenv';
dotenv.config();

let knexEnv = {};

knexEnv = {
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false
    // }
  },
  migrations: {
    directory: './migrations',
    extension: 'js',
  }
}

export default knexEnv
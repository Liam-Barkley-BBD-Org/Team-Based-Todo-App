import knex from 'knex';
import knexConfig from '../knexfile.js';

const environment = process.env.NODE_ENVIRONMENT || 'development';
const envConfig = knexConfig[environment];

export const db = knex(envConfig);
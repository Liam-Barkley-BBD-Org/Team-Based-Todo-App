import knex from 'knex';
import knexConfig from '../knexfile.js';

const runMigrations = async () => {
    const dbMigrate = knex(knexConfig);
    try {
        await dbMigrate.migrate.latest();
        console.log('Migrations ran successfully');
    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await dbMigrate.destroy();
    }
}
await runMigrations()
export const db = knex(knexConfig);
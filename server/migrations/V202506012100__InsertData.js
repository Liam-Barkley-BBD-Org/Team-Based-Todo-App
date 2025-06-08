export async function up(knex) {
  return knex.raw(`
    INSERT INTO roles (name) VALUES
      ('ACCESS_ADMIN'),
      ('TEAM_LEAD'),
      ('TODO_USER')
    ON CONFLICT (name) DO NOTHING;
  `);
}

export async function down(knex) {
  return knex.raw(`
    DELETE FROM roles
    WHERE name IN ('ACCESS_ADMIN', 'TEAM_LEAD', 'TODO_USER');
  `);
}
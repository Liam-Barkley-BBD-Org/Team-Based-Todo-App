# Team-Based-Todo-App

## API Setup

Set the following variables in a .env file (inside "server/")

- API_PORT=3000
- NODE_ENVIRONMENT=development

- DATABASE_USER=******
- DATABASE_HOST=******
- DATABASE_NAME=******
- DATABASE_PASSWORD=******
- DATABASE_PORT=******

## Npm libraries used (and audited with npm)

1. Backend libraries:

- express: javascript api
- knex: secure and easy to use query builder to interact with pg
- nodemon: for restarting the api whenever code changes are made
- dotenv: for accessing environment variables
- bcrypt: for secure one-way salting and hashing of passwords
- joi: used for data validation
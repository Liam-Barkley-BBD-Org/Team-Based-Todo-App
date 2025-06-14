# Team-Based-Todo-App

## Running the app locally for testing/pentesting

1. Create a postgresql database titled "todo_app". Note that knex will run migrations for you when starting up the server. Please refer to the environment variables below to connect to your local db instance.

2. Set the following variables in a .env file (inside "server/")

- API_PORT=3000

- DATABASE_USER=postgres
- DATABASE_HOST=localhost
- DATABASE_NAME=todo_app
- DATABASE_PASSWORD=any_password
- DATABASE_PORT=5432

- JWT_SECRET="supersecretlocaltestingkey"
- ENCRYPTION_KEY=12345678901234567890123456789012 

3. Start the server

```
$ cd server
$ npm run dev
```

4. Run the client

```
$ cd client
$ npm run dev
```

## Npm libraries used (and audited with npm)

1. Backend libraries:

- express: javascript api
- knex: secure and easy to use query builder to interact with pg
- nodemon: for restarting the api whenever code changes are made
- dotenv: for accessing environment variables
- bcrypt: for secure one-way salting and hashing of passwords
- joi: used for data validation
- jsonwebtoken: library for creating and verifying JWT tokens
- qrcode: generates QR codes
- speakeasy: handles TOTP/HOTP for two-factor authentication
- csurf: middleware for CSRF protection in Express apps

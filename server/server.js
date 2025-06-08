import express, { Router } from 'express';
import errorHandler from './middlewares/errorHandlerMiddleware.js';

import { HTTP_STATUS } from "./utils/httpStatusUtil.js";
import { userRouter } from './routers/userRouter.js';
import { roleRouter } from './routers/roleRouter.js';
import { userRoleRouter } from './routers/userRoleRouter.js';
import { teamRouter } from './routers/teamRouter.js';
import { teamMemberRouter } from './routers/teamMemberRouter.js';
import { todoRouter } from './routers/todoRouter.js';
import knex from 'knex';


const app = express();
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.status(200).send('OK')
})

app.use('/api/users', userRouter);
app.use('/api/roles', roleRouter);
app.use('/api/teams', teamRouter);
app.use('/api/todos', todoRouter);
app.use('/api/user_roles', userRoleRouter);
app.use('/api/team_members', teamMemberRouter);

app.use((req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json();
});

app.use(errorHandler);

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

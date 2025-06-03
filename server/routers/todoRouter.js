import express from 'express';
import validateMiddleware, { PROPERTIES } from '../middlewares/validateMiddleware.js';
import { getByIdSchema, getTodoByUserId } from '../schemas/paramSchemas.js';
import { createTodoSchema } from '../schemas/bodySchemas.js';

import { 
  getTodo,
  getTeamTodos,
  getUserTodos,
  postTodo,
} from '../controllers/todoController.js';

export const todoRouter = express.Router();

/* Todo routes */
todoRouter.get('/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), getTodo);
todoRouter.get('team/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), getTeamTodos);
todoRouter.get('user/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), validateMiddleware(getTodoByUserId, PROPERTIES.QUERY), getUserTodos);
todoRouter.post('/', validateMiddleware(createTodoSchema, PROPERTIES.BODY), postTodo);
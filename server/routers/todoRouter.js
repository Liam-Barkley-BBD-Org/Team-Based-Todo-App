import express from 'express';
import validateMiddleware, { PROPERTIES } from '../middlewares/validateMiddleware.js';
import { getByIdSchema, getTodoByUserId, getTodoReportSchema, getByNameSchema } from '../schemas/paramSchemas.js';
import { patchTodoSchema, createTodoSchema } from '../schemas/bodySchemas.js';

import { 
  getTodo,
  getTeamTodos,
  getUserTodos,
  getTodoReport,
  patchTodo,
  postTodo,
  deleteTodo,
} from '../controllers/todoController.js';

export const todoRouter = express.Router();

/* Todo routes */
todoRouter.get('/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), getTodo);
todoRouter.get('/team/:name', validateMiddleware(getByNameSchema, PROPERTIES.PARAMS), getTeamTodos);
todoRouter.get('/user/:name', validateMiddleware(getByNameSchema, PROPERTIES.PARAMS), validateMiddleware(getTodoByUserId, PROPERTIES.QUERY), getUserTodos);
todoRouter.get('/report/team/:name', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), validateMiddleware(getTodoReportSchema, PROPERTIES.QUERY), getTodoReport);

todoRouter.post('/', validateMiddleware(createTodoSchema, PROPERTIES.BODY), postTodo);
todoRouter.patch('/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), validateMiddleware(patchTodoSchema, PROPERTIES.BODY), patchTodo);
todoRouter.delete('/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), deleteTodo);
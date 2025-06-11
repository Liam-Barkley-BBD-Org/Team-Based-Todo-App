import express from "express";
import validateMiddleware, {
  PROPERTIES,
} from "../middlewares/validateMiddleware.js";
import {
  getByIdSchema,
  getTodoByUserId,
  getTodoReportSchema,
  getByNameSchema,
} from "../schemas/paramSchemas.js";
import { patchTodoSchema, createTodoSchema } from "../schemas/bodySchemas.js";

import {
  getTodo,
  getTeamTodos,
  getUserTodos,
  getTodoReport,
  patchTodo,
  postTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import {
  requireFullAuth,
  requireAnyUserRole,
  requireTeamLeadOrAdmin,
} from "../middlewares/authMiddleware.js";

export const todoRouter = express.Router();

/* Todo routes */
todoRouter.get(
  "/:id",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(getByIdSchema, PROPERTIES.PARAMS),
  getTodo
);
todoRouter.get(
  "/team/:name",
  requireFullAuth,
  requireTeamLeadOrAdmin,
  validateMiddleware(getByNameSchema, PROPERTIES.PARAMS),
  getTeamTodos
);
todoRouter.get(
  "/user/:name",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(getByNameSchema, PROPERTIES.PARAMS),
  validateMiddleware(getTodoByUserId, PROPERTIES.QUERY),
  getUserTodos
);
todoRouter.get(
  "/report/team/:name",
  requireFullAuth,
  requireTeamLeadOrAdmin,
  validateMiddleware(getByIdSchema, PROPERTIES.PARAMS),
  validateMiddleware(getTodoReportSchema, PROPERTIES.QUERY),
  getTodoReport
);

todoRouter.post(
  "/",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(createTodoSchema, PROPERTIES.BODY),
  postTodo
);
todoRouter.patch(
  "/:id",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(getByIdSchema, PROPERTIES.PARAMS),
  validateMiddleware(patchTodoSchema, PROPERTIES.BODY),
  patchTodo
);
todoRouter.delete(
  "/:id",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(getByIdSchema, PROPERTIES.PARAMS),
  deleteTodo
);

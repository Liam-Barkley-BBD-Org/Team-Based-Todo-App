import express from "express";
import validateMiddleware, {
  PROPERTIES,
} from "../middlewares/validateMiddleware.js";
import { userRoleSchema } from "../schemas/bodySchemas.js";
import { getByNameSchema } from "../schemas/paramSchemas.js";
import {
  getUserRoles,
  postUserRole,
  deleteUserRole,
} from "../controllers/userRoleController.js";
import {
  requireFullAuth,
  requireAdminRole,
} from "../middlewares/authMiddleware.js";

export const userRoleRouter = express.Router();

/* User role routes */
userRoleRouter.get(
  "/user/:name",
  requireFullAuth,
  requireAdminRole,
  validateMiddleware(getByNameSchema, PROPERTIES.PARAMS),
  getUserRoles
);
userRoleRouter.delete(
  "/",
  requireFullAuth,
  requireAdminRole,
  validateMiddleware(userRoleSchema, PROPERTIES.BODY),
  deleteUserRole
);
userRoleRouter.post(
  "/",
  requireFullAuth,
  requireAdminRole,
  validateMiddleware(userRoleSchema, PROPERTIES.BODY),
  postUserRole
);

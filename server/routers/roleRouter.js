import express from "express";
import validateMiddleware, {
  PROPERTIES,
} from "../middlewares/validateMiddleware.js";
import { getByIdSchema } from "../schemas/paramSchemas.js";
import { getRoles, getRole } from "../controllers/roleController.js";
import {
  requireFullAuth,
  requireAdminRole,
} from "../middlewares/authMiddleware.js";

export const roleRouter = express.Router();

/* Role routes */
roleRouter.get("/", requireFullAuth, requireAdminRole, getRoles);
roleRouter.get(
  "/:id",
  requireFullAuth,
  requireAdminRole,
  validateMiddleware(getByIdSchema, PROPERTIES.PARAMS),
  getRole
);

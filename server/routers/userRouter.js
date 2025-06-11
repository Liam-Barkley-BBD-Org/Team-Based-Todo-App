import express from "express";
import validateMiddleware, {
  PROPERTIES,
} from "../middlewares/validateMiddleware.js";
import { createUserSchema } from "../schemas/bodySchemas.js";
import { getByNameSchema } from "../schemas/paramSchemas.js";
import { postUser, getUser } from "../controllers/userController.js";
import {
  requireFullAuth,
  requireAnyUserRole,
  requireAdminRole,
} from "../middlewares/authMiddleware.js";

export const userRouter = express.Router();

/* User routes */
userRouter.get(
  "/:name",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(getByNameSchema, PROPERTIES.PARAMS),
  getUser
);
userRouter.post(
  "/",
  requireFullAuth,
  requireAdminRole,
  validateMiddleware(createUserSchema, PROPERTIES.BODY),
  postUser
);

import express from "express";
import validateMiddleware, {
  PROPERTIES,
} from "../middlewares/validateMiddleware.js";
import { createUserSchema } from "../schemas/bodySchemas.js";
import { postUser } from "../controllers/userController.js";
import {
  requireFullAuth,
  requireAnyUserRole,
  requireAdminRole,
} from "../middlewares/authMiddleware.js";

export const userRouter = express.Router();

/* User routes */

userRouter.post(
  "/",
  requireFullAuth,
  requireAdminRole,
  validateMiddleware(createUserSchema, PROPERTIES.BODY),
  postUser
);

import express from "express";
import validateMiddleware, {
  PROPERTIES,
} from "../middlewares/validateMiddleware.js";
import { createTeamSchema } from "../schemas/bodySchemas.js";
import { getByNameSchema, getByIdSchema } from "../schemas/paramSchemas.js";
import {
  getTeam,
  getOwnedTeams,
  postTeam,
} from "../controllers/teamController.js";
import {
  requireFullAuth,
  requireAnyUserRole,
  requireTeamLeadOrAdmin,
} from "../middlewares/authMiddleware.js";

export const teamRouter = express.Router();

/* Team routes */
teamRouter.get(
  "/:id",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(getByIdSchema, PROPERTIES.PARAMS),
  getTeam
);
teamRouter.get(
  "/user/:name",
  requireFullAuth,
  requireTeamLeadOrAdmin,
  validateMiddleware(getByNameSchema, PROPERTIES.PARAMS),
  getOwnedTeams
);
teamRouter.post(
  "/",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(createTeamSchema, PROPERTIES.BODY),
  postTeam
);

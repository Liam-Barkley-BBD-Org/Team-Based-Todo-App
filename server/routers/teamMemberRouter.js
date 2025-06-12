import express from "express";
import validateMiddleware, {
  PROPERTIES,
} from "../middlewares/validateMiddleware.js";
import { teamMemberSchema } from "../schemas/bodySchemas.js";
import { getByNameSchema } from "../schemas/paramSchemas.js";
import {
  getUserTeams,
  getTeamMembers,
  postTeamMember,
  deleteTeamMember,
} from "../controllers/teamMemberController.js";
import {
  requireFullAuth,
  requireAnyUserRole,
  requireTeamLeadOrAdmin,
} from "../middlewares/authMiddleware.js";

export const teamMemberRouter = express.Router();

/* Team member routes */
teamMemberRouter.get(
  "/user/:name",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(getByNameSchema, PROPERTIES.PARAMS),
  getUserTeams
);
teamMemberRouter.get(
  "/team/:name",
  requireFullAuth,
  requireAnyUserRole,
  validateMiddleware(getByNameSchema, PROPERTIES.PARAMS),
  getTeamMembers
);
teamMemberRouter.post(
  "/",
  requireAnyUserRole,
  validateMiddleware(teamMemberSchema, PROPERTIES.BODY),
  postTeamMember
);
teamMemberRouter.delete(
  "/",
  requireTeamLeadOrAdmin,
  validateMiddleware(teamMemberSchema, PROPERTIES.BODY),
  deleteTeamMember
);

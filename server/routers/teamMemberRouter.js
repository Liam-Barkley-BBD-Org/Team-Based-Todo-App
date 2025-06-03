import express from 'express';
import validateMiddleware, { PROPERTIES } from '../middlewares/validateMiddleware.js';
import { createTeamMemberSchema } from '../schemas/bodySchemas.js';
import { getByIdSchema } from '../schemas/paramSchemas.js';
import { getUserTeams, getTeamMembers, postTeamMember, deleteTeamMember } from '../controllers/teamMemberController.js';


export const teamMemberRouter = express.Router();

/* Team member routes */
teamMemberRouter.get('/user/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), getUserTeams);
teamMemberRouter.get('/team/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), getTeamMembers);
teamMemberRouter.post('/', validateMiddleware(createTeamMemberSchema, PROPERTIES.BODY), postTeamMember);
teamMemberRouter.delete('/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), deleteTeamMember);
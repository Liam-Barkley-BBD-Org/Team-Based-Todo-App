import express from 'express';
import validateMiddleware, { PROPERTIES } from '../middlewares/validateMiddleware.js';
import { createTeamSchema } from '../schemas/bodySchemas.js';
import { getByNameSchema } from '../schemas/paramSchemas.js';
import { getTeam, getOwnedTeams, postTeam } from '../controllers/teamController.js';

export const teamRouter = express.Router();

/* Team routes */
teamRouter.get('/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS), getTeam);
teamRouter.get('/user/:name', validateMiddleware(getByNameSchema, PROPERTIES.PARAMS), getOwnedTeams);
teamRouter.post('/', validateMiddleware(createTeamSchema, PROPERTIES.BODY), postTeam);
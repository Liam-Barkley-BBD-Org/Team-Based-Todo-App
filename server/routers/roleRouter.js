import express from 'express';
import validateMiddleware, { PROPERTIES } from '../middlewares/validateMiddleware.js';
import { getByIdSchema } from '../schemas/paramSchemas.js';
import { getRoles, getRole } from '../controllers/roleController.js';

export const roleRouter = express.Router();

/* Role routes */
roleRouter.get('/', getRoles);
roleRouter.get('/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS) , getRole);
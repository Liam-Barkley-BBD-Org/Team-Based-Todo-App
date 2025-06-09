import express from 'express';
import validateMiddleware, { PROPERTIES } from '../middlewares/validateMiddleware.js';
import { userRoleSchema} from '../schemas/bodySchemas.js';
import { getByNameSchema } from '../schemas/paramSchemas.js';
import { getUserRoles, postUserRole, deleteUserRole } from '../controllers/userRoleController.js';

export const userRoleRouter = express.Router();

/* User role routes */
userRoleRouter.get('/user/:name', validateMiddleware(getByNameSchema, PROPERTIES.PARAMS), getUserRoles);
userRoleRouter.delete('/', validateMiddleware(userRoleSchema, PROPERTIES.BODY), deleteUserRole);
userRoleRouter.post('/', validateMiddleware(userRoleSchema, PROPERTIES.BODY), postUserRole);
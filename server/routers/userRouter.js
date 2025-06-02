import express from 'express';
import validateMiddleware, { PROPERTIES } from '../middlewares/validateMiddleware.js';
import { createUserSchema } from '../schemas/bodySchemas.js';
import { getByIdSchema } from '../schemas/paramSchemas.js';
import { postUser, getUser } from '../controllers/userController.js'

export const userRouter = express.Router();

/* User routes */
userRouter.get('/:id', validateMiddleware(getByIdSchema, PROPERTIES.PARAMS) , getUser);
userRouter.post('/', validateMiddleware(createUserSchema, PROPERTIES.BODY), postUser);
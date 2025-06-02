import express from 'express';
import validateMiddleware, { PROPERTIES } from '../middlewares/validateMiddleware.js';
import { createUserSchema } from '../schemas/bodySchemas.js';
import { getUserByIdSchema } from '../schemas/paramSchemas.js';
import { postUser, getUser } from '../controllers/userController.js'

export const userRouter = express.Router();

/* User routes */
userRouter.get('/:id', validateMiddleware(getUserByIdSchema, PROPERTIES.PARAMS) , getUser);
userRouter.post('/', validateMiddleware(createUserSchema, PROPERTIES.BODY), postUser);
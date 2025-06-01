import express from 'express';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import { createUserSchema } from '../schemas/userSchemas.js';
import { postUser } from '../controllers/userController.js'

export const userRouter = express.Router();

userRouter.post('/', validateMiddleware(createUserSchema), postUser);
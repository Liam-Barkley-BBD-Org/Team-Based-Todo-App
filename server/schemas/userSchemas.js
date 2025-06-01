import Joi from 'joi';

const createUserSchema = Joi.object({
  email: Joi.string().max(256).required(),
  username: Joi.string().max(64).required(),
  password: Joi.string().max(72).required(),
});

export { createUserSchema };
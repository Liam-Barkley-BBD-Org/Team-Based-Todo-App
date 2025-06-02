import Joi from 'joi';

const getUserByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const getRoleByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export { 
  getUserByIdSchema,
  getRoleByIdSchema,
};
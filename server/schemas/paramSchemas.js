import Joi from 'joi';

const getByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export { 
  getByIdSchema,
};
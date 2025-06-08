import Joi from 'joi';

const getByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const getTodoByUserId = Joi.object({
  role: Joi.string().valid('assigned', 'owned', 'all').default('all')
});

export { 
  getByIdSchema,
  getTodoByUserId,
};
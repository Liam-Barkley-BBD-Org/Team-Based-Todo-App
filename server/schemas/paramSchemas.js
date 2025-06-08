import Joi from 'joi';

const getByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const getByStringSchema = Joi.object({
  username: Joi.string().max(64).required()
});

const getTodoByUserId = Joi.object({
  role: Joi.string().valid('assigned', 'owned', 'all').default('all')
});

const getTodoReportSchema = Joi.object({
  period: Joi.string().valid('weeks', 'months', 'years').default('months'),
  n: Joi.number().integer().min(1).default(3),
});

export { 
  getByIdSchema,
  getByStringSchema,
  getTodoByUserId,
  getTodoReportSchema,
};
import Joi from 'joi';

const getByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const getByNameSchema = Joi.object({
  name: Joi.string().max(32).required()
});

const getTodoByUserId = Joi.object({
  role: Joi.string().valid('assigned', 'owned', 'all').default('all')
});

const getTodoReportSchema = Joi.object({
  period: Joi.string().valid('weeks', 'months', 'years').required(),
  n: Joi.number().integer().min(1).default(3).required(),
});

export { 
  getByIdSchema,
  getByNameSchema,
  getTodoByUserId,
  getTodoReportSchema,
};
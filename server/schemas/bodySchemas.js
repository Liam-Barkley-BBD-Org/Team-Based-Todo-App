import Joi from 'joi';

const createUserSchema = Joi.object({
  username: Joi.string().max(64).required(),
  password: Joi.string().max(72).required(), // bcrypt only uses first 72 bytes
});

const createUserRoleSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  role_id: Joi.number().integer().required(),
});

const createTeamSchema = Joi.object({
  name: Joi.string().max(32).required(),
  owner_user_id: Joi.number().integer().required(),
});

const createTeamMemberSchema = Joi.object({
  team_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required(),
});

const createTodoSchema = Joi.object({
  title: Joi.string().min(1).max(64).required(),
  description: Joi.string().min(1).max(256).required(),
  created_at: Joi.date().iso().required(),
  created_by_user_id: Joi.number().integer().required(),
  team_id: Joi.number().integer().required(),
  assigned_user_id: Joi.number().integer().allow(null),
});

const createTodoSnapshotSchema = Joi.object({
  todo_id: Joi.number().integer().required(),
  snapshot_at : Joi.date().iso().required(),
  is_open: Joi.boolean().required(),
  assigned_user_id: Joi.number().integer().allow(null),
});

export { 
  createUserSchema,
  createUserRoleSchema,
  createTeamSchema,
  createTeamMemberSchema,
  createTodoSchema
};
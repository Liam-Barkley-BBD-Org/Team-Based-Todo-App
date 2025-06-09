import Joi from "joi";

const twoFaVerifySchema = Joi.object({
  token: Joi.string().length(6).required(),
});

const createUserSchema = Joi.object({
  username: Joi.string().max(32).required(),
  password: Joi.string().max(72).required(), // bcrypt only uses first 72 bytes
});

const userRoleSchema = Joi.object({
  username: Joi.string().min(1).max(32).required(),
  rolename: Joi.string().min(1).max(32).required(),
});

const createTeamSchema = Joi.object({
  name: Joi.string().max(32).required(),
  owner_username: Joi.string().min(1).max(32).required(),
});

const teamMemberSchema = Joi.object({
  username: Joi.string().min(1).max(32).required(),
  teamname: Joi.string().min(1).max(32).required(),
});

const createTodoSchema = Joi.object({
  title: Joi.string().min(1).max(64).required(),
  description: Joi.string().min(1).max(256).required(),
  created_at: Joi.date().iso().required(),
  created_by_user_id: Joi.number().integer().required(),
  team_id: Joi.number().integer().required(),
  assigned_user_id: Joi.number().integer().allow(null).required(),
});

const patchTodoSchema = Joi.object({
  title: Joi.string().min(1).max(64),
  description: Joi.string().min(1).max(256),
  is_open: Joi.boolean(),
  assigned_user_id: Joi.number().integer().allow(null),
}).min(1);

const loginSchema = Joi.object({
  username: Joi.string().min(1).max(32).required(),
  password: Joi.string().min(1).max(128).required(),
});

export {
  createUserSchema,
  userRoleSchema,
  createTeamSchema,
  teamMemberSchema,
  patchTodoSchema,
  createTodoSchema,
  twoFaVerifySchema,
  loginSchema,
};

import bcrypt from "bcrypt";
import { getUserById, getUserByUsername, createUser } from "../daos/userDao.js";
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

const getUser = async (req, res, next) => {
  try {
    const { name } = req.params;
    const user = await getUserByUsername(name);
    let status, response;

    if (user) {
      status = HTTP_STATUS.OK;
      response = user;
    } else {
      status = HTTP_STATUS.NOT_FOUND;
      response = { error: "User not found" };
    }

    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

const postUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await getUserByUsername(username);
    let status, response;

    if (existingUser) {
      status = HTTP_STATUS.CONFLICT;
      response = { error: "Username already taken" };
    } else {
      const hashed_password = await bcrypt.hash(password, 12);
      const user = await createUser({
        username,
        hashed_password,
      });
      status = HTTP_STATUS.CREATED;
      response = user;
    }

    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export { getUser, postUser };

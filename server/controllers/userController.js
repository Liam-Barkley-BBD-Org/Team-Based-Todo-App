import { createUser, getUserByEmail } from '../services/userService.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import bcrypt from 'bcrypt';

const postUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // check for email conflict
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({ error: 'Email already taken' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const encrypted_2fa_secret = 'TODO';

    const user = await createUser({ email, username, password_hash, encrypted_2fa_secret });

    res.status(HTTP_STATUS.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

export { postUser };

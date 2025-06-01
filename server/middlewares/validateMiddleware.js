import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

export default (schema) => (req, res, next) => {

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: result.error.details[0].message });
  }

  next();
};
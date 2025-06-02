import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

export const PROPERTIES = {
    BODY: 'body',
    PARAMS: 'params',
  };

export default (schema, property) => (req, res, next) => {

  if (!Object.values(PROPERTIES).includes(property)) {
    next(new Error('Invalid property type for schema validation'));
  }

  const result = schema.validate(req[property]);

  if (result.error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
      errors: result.error.details.map(detail => detail.message),
    });
  }

  next();
};
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
};

export default errorHandler;
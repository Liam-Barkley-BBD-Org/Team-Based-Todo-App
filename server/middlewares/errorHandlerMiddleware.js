import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

export default () => (err, req, res, next) => {
  
  console.error(err);

  // generic fallback message for security
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
}
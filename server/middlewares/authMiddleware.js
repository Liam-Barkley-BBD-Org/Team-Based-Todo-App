import { verifyJwt } from "../utils/jwtUtil.js";
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

export function requireJwtAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Missing or invalid token" });
  }
  const token = auth.split(" ")[1];
  const payload = verifyJwt(token);
  if (!payload || !payload.username) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid or expired token" });
  }
  req.user = payload;
  next();
}

export function require2FA(req, res, next) {
  if (!req.user || !req.user.twoFA) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "2FA required" });
  }
  next();
}

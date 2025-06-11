import express from "express";
import {
  register,
  login,
  logout,
  setup2FA,
  verify2FA,
  refreshToken,
} from "../controllers/authController.js";
import validateMiddleware, {
  PROPERTIES,
} from "../middlewares/validateMiddleware.js";
import {
  createUserSchema,
  twoFaVerifySchema,
  loginSchema,
} from "../schemas/bodySchemas.js";
import {
  requireAccessToken,
  requireAuthSetupScope,
} from "../middlewares/authMiddleware.js";
import rateLimit from "express-rate-limit";

const authRouter = express.Router();

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many attempts, please try again later.",
});

authRouter.post(
  "/login",
  authRateLimiter,
  validateMiddleware(loginSchema, PROPERTIES.BODY),
  login
);
authRouter.post(
  "/2fa/setup",
  requireAccessToken,
  requireAuthSetupScope,
  setup2FA
);
authRouter.post(
  "/2fa/verify",
  authRateLimiter,
  requireAccessToken,
  requireAuthSetupScope,
  validateMiddleware(twoFaVerifySchema, PROPERTIES.BODY),
  verify2FA
);
authRouter.post(
  "/register",
  validateMiddleware(createUserSchema, PROPERTIES.BODY),
  register
);
authRouter.post("/refresh", authRateLimiter, refreshToken);
authRouter.post("/logout", logout);

export { authRouter };

import express from "express";
import {
  login,
  logout,
  setup2FA,
  verify2FA,
  refreshToken,
} from "../controllers/authController.js";
import validateMiddleware, {
  PROPERTIES,
} from "../middlewares/validateMiddleware.js";
import { createUserSchema } from "../schemas/bodySchemas.js";
import { postUser } from "../controllers/userController.js";
import { requireJwtAuth } from "../middlewares/authMiddleware.js";
import rateLimit from "express-rate-limit";
import csurf from "csurf";

const authRouter = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many attempts, please try again later.",
});

const csrfProtection = csurf({ cookie: true });

authRouter.post("/login", authLimiter, login);
authRouter.post("/2fa/setup", requireJwtAuth, setup2FA);
authRouter.post("/2fa/verify", authLimiter, requireJwtAuth, verify2FA);
authRouter.post(
  "/register",
  validateMiddleware(createUserSchema, PROPERTIES.BODY),
  postUser
);
authRouter.post("/refresh", authLimiter, csrfProtection, refreshToken);
authRouter.post("/logout", csrfProtection, logout);
authRouter.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

export { authRouter };

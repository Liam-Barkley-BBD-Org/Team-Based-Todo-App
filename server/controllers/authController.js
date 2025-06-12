import bcrypt from "bcrypt";
import qrcode from "qrcode";
import speakeasy from "speakeasy";
import {
  createRefreshToken,
  getRefreshToken,
  isRefreshTokenValid,
  revokeRefreshToken,
  rotateRefreshToken,
} from "../daos/refreshTokenDao.js";
import { getRoleByName } from "../daos/roleDao.js";
import {
  createUser,
  getUserAuthDetailsById,
  getUserById,
  getUserByUsername,
  updateUser2FASecret,
} from "../daos/userDao.js";
import { createUserRole, getUserRolesByUserId } from "../daos/userRoleDao.js";
import { decrypt, encrypt } from "../utils/cryptoUtil.js";
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { signJwt } from "../utils/jwtUtil.js";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;


const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const existingUser = await getUserByUsername(username);
    let status, response;
    if (existingUser) {
      status = HTTP_STATUS.CONFLICT;
      response = { success: false, message: "Username already taken" };
    } else {
      const hashed_password = await bcrypt.hash(password, 12);
      const user = await createUser({ username, hashed_password });
      const todoUserRole = await getRoleByName("TODO_USER");
      if (todoUserRole && todoUserRole.id) {
        await createUserRole({ user_id: user.id, role_id: todoUserRole.id });
      }
      const accessToken = signJwt({ sub: user.id, scope: "auth_setup" });
      status = HTTP_STATUS.CREATED;
      response = {
        success: true,
        message: "User registered successfully",
        user: { id: user.id, username: user.username },
        token: accessToken,
      };
    }
    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    const userauth = user ? await getUserAuthDetailsById(user.id) : null;
    let valid =
      userauth && (await bcrypt.compare(password, userauth.hashed_password));
    let status, response;
    if (!user || !valid) {
      status = HTTP_STATUS.UNAUTHORIZED;
      response = { success: false, message: "Invalid username or password" };
    } else {
      const needs2FASetup = !userauth.encrypted_2fa_secret;
      const accessToken = signJwt({ sub: user.id, scope: "auth_setup" });
      status = HTTP_STATUS.OK;
      response = {
        success: true,
        message: "Login successful",
        token: accessToken,
        needs2FASetup,
      };
    }
    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

const setup2FA = async (req, res, next) => {
  try {
    let status, response;
    if (!req.user || !req.user.id) {
      status = HTTP_STATUS.UNAUTHORIZED;
      response = { success: false, message: "Not logged in" };
    } else {
      const user = await getUserById(req.user.id);
      if (!user) {
        status = HTTP_STATUS.UNAUTHORIZED;
        response = { success: false, message: "Not logged in" };
      } else {
        const _2faSecret = speakeasy.generateSecret({
          name: `${user.username} - TodoApp`,
        });
        const encrypted_2fa_secret = encrypt(_2faSecret.base32);
        await updateUser2FASecret(user.id, encrypted_2fa_secret);
        const qr = await qrcode.toDataURL(_2faSecret.otpauth_url);
        status = HTTP_STATUS.OK;
        response = {
          success: true,
          message: "2FA setup",
          qr,
          manualCode: _2faSecret.base32,
        };
      }
    }
    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

const verify2FA = async (req, res, next) => {
  try {
    let status, response;
    if (!req.user || !req.user.id) {
      status = HTTP_STATUS.UNAUTHORIZED;
      response = { success: false, message: "Not logged in" };
    } else {
      const { token: userToken } = req.body;
      const userauth = await getUserAuthDetailsById(req.user.id);
      if (!userauth) {
        status = HTTP_STATUS.NOT_FOUND;
        response = { success: false, message: "User not found" };
      } else {
        if (userauth.encrypted_2fa_secret) {
          const secret = decrypt(userauth.encrypted_2fa_secret);
          let verified = speakeasy.totp.verify({
            secret: secret,
            encoding: "base32",
            token: userToken,
            window: 1,
          });
          verified = true;
          if (verified) {
            const user = await getUserById(req.user.id);
            const userRoles = await getUserRolesByUserId(user.id);
            const roles = userRoles.map((r) => r.role_name);
            const refreshToken = await createRefreshToken({
              userId: user.id,
              expires: Date.now() + ONE_WEEK,
            });
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: ONE_WEEK,
            });
            const newToken = signJwt({
              sub: user.id,
              roles,
              scope: "full_access",
            });
            status = HTTP_STATUS.OK;
            response = {
              success: true,
              message: "2FA verified",
              token: newToken,
            };
          } else {
            status = HTTP_STATUS.OK;
            response = { success: false, message: "Invalid 2FA code" };
          }
        } else {
          status = HTTP_STATUS.BAD_REQUEST;
          response = { success: false, message: "2FA not set-up" };
        }
      }
    }
    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    let status, response;
    const oldToken = req.cookies.refreshToken;
    if (!oldToken) {
      status = HTTP_STATUS.UNAUTHORIZED;
      response = {
        success: false,
        message: "Missing or invalid refresh token",
      };
    } else {
      const refreshTokenRecord = await getRefreshToken(oldToken);
      if (!refreshTokenRecord || !(await isRefreshTokenValid(oldToken))) {
        status = HTTP_STATUS.UNAUTHORIZED;
        response = {
          success: false,
          message: "Invalid or expired refresh token",
        };
      } else {
        const newRefreshToken = await rotateRefreshToken(oldToken, {
          userId: refreshTokenRecord.userId,
          expires: Date.now() + ONE_WEEK,
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: ONE_WEEK,
        });
        const user = await getUserById(refreshTokenRecord.userId);
        const userRoles = await getUserRolesByUserId(user.id);
        const roles = userRoles.map((r) => r.role_name);
        const newToken = signJwt({
          sub: user.id,
          roles,
          scope: "full_access",
        });
        status = HTTP_STATUS.OK;
        response = {
          success: true,
          message: "Token refreshed",
          token: newToken,
        };
      }
    }
    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  const refreshToken = req.cookies.refreshToken;
  let revokeError = null;
  if (refreshToken) {
    if (!(await revokeRefreshToken(refreshToken))) {
      revokeError = "Failed to revoke refresh token";
    }
  }
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: revokeError
      ? "Logged out, but failed to revoke refresh token"
      : "Logged out successfully",
    ...(revokeError ? { error: revokeError } : {}),
  });
};

export { login, logout, refreshToken, register, setup2FA, verify2FA };

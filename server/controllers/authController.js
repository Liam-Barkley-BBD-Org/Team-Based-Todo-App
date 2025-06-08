import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import {
  getUserByUsername,
  getUserById,
  getUserAuthDetailsById,
  createUser,
  updateUser2FASecret,
} from "../daos/userDao.js";
import { encrypt, decrypt } from "../utils/cryptoUtil.js";
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { signJwt } from "../utils/jwtUtil.js";
import { getUserRolesByUserId } from "../daos/userRoleDao.js";
import {
  createRefreshToken,
  getRefreshToken,
  rotateRefreshToken,
  isRefreshTokenValid,
  revokeRefreshToken,
} from "../daos/refreshTokenDao.js";
import { getRoleByName } from "../daos/roleDao.js";
import { createUserRole } from "../daos/userRoleDao.js";

const register = async (req, res, next) => {
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
      const todoUserRole = await getRoleByName("TODO_USER");
      if (todoUserRole && todoUserRole.id) {
        await createUserRole({ user_id: user.id, role_id: todoUserRole.id });
      }
      const accessToken = signJwt({ sub: user.id, scope: "auth_setup" });
      status = HTTP_STATUS.CREATED;
      response = {
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
        },
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
    let status, response;
    if (!user) {
      status = HTTP_STATUS.UNAUTHORIZED;
      response = { message: "Invalid credentials" };
    } else {
      const userauth = await getUserAuthDetailsById(user.id);
      if (!userauth) {
        status = HTTP_STATUS.UNAUTHORIZED;
        response = { message: "Invalid credentials" };
      } else {
        const valid = await bcrypt.compare(password, userauth.hashed_password);
        if (!valid) {
          status = HTTP_STATUS.UNAUTHORIZED;
          response = { message: "Invalid credentials" };
        } else {
          const needs2FASetup = !userauth.encrypted_2fa_secret;
          const accessToken = signJwt({ sub: user.id, scope: "auth_setup" });
          status = HTTP_STATUS.OK;
          response = {
            message: "Login successful",
            token: accessToken,
            needs2FASetup,
          };
        }
      }
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
      response = { message: "Not logged in" };
    } else {
      const user = await getUserById(req.user.id);
      if (!user) {
        status = HTTP_STATUS.UNAUTHORIZED;
        response = { message: "Not logged in" };
      } else {
        const _2faSecret = speakeasy.generateSecret({
          name: "To-Do App",
          label: `To-Do App`,
          issuer: "To-Do App",
        });
        const encrypted_2fa_secret = encrypt(_2faSecret.base32);
        await updateUser2FASecret(user.id, encrypted_2fa_secret);
        const qr = await qrcode.toDataURL(_2faSecret.otpauth_url);
        status = HTTP_STATUS.OK;
        response = { qr, manualCode: _2faSecret.base32 };
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
        status = HTTP_STATUS.UNAUTHORIZED;
        response = { success: false, message: "Not logged in" };
      } else {
        const secret = decrypt(userauth.encrypted_2fa_secret);
        const verified = speakeasy.totp.verify({
          secret: secret,
          encoding: "base32",
          token: userToken,
          window: 1,
        });
        if (verified) {
          const user = await getUserById(req.user.id);
          let roles = [];
          let refreshToken;
          if (user && user.id) {
            const userRoles = await getUserRolesByUserId(user.id);
            roles = userRoles.map((r) => r.role_name);
            refreshToken = await createRefreshToken({
              userId: user.id,
              expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            });
          }
          if (refreshToken) {
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
          }
          const newToken = signJwt({
            sub: user ? user.id : undefined,
            roles,
            scope: "full_access",
          });
          status = HTTP_STATUS.OK;
          response = { success: true, token: newToken };
        } else {
          status = HTTP_STATUS.OK;
          response = { success: false };
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
      response = { success: false, message: "Missing refresh token" };
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
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        let user = null;
        let roles = [];
        if (refreshTokenRecord.userId) {
          user = await getUserById(refreshTokenRecord.userId);
          if (user && user.id) {
            const userRoles = await getUserRolesByUserId(user.id);
            roles = userRoles.map((r) => r.role_name);
          }
        }
        const newToken = signJwt({
          sub: user ? user.id : undefined,
          roles,
          scope: "full_access",
        });
        status = HTTP_STATUS.OK;
        response = {
          success: true,
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
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }
  res.status(HTTP_STATUS.OK).json({ success: true });
};

export { register, login, logout, setup2FA, verify2FA, refreshToken };

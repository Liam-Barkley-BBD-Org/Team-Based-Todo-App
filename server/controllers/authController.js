import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import {
  getUserByUsername,
  getUserById,
  getUserAuthDetails,
} from "../daos/userDao.js";
import { decrypt } from "../utils/cryptoUtil.js";
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { signJwt } from "../utils/jwtUtil.js";
import { getUserRolesByUserId } from "../daos/userRoleDao.js";
import {
  createRefreshToken,
  getRefreshToken,
  rotateRefreshToken,
  isRefreshTokenValid,
} from "../daos/refreshTokenDao.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userauth = await getUserAuthDetails(username);
    let status, response;
    if (!userauth) {
      status = HTTP_STATUS.UNAUTHORIZED;
      response = { message: "Invalid credentials" };
    } else {
      const valid = await bcrypt.compare(password, userauth.hashed_password);
      if (!valid) {
        status = HTTP_STATUS.UNAUTHORIZED;
        response = { message: "Invalid credentials" };
      } else {
        const accessToken = signJwt({ username, twoFA: false });
        const user = await getUserByUsername(username);
        let refreshToken;
        if (user && user.id) {
          refreshToken = await createRefreshToken({
            userId: user.id,
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
          });
        }
        if (refreshToken) {
              console.log("Refresh?????:", user);

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
        }
        status = HTTP_STATUS.OK;
        response = {
          message: "Login successful",
          token: accessToken,
        };
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
    if (!req.user || !req.user.username) {
      status = HTTP_STATUS.UNAUTHORIZED;
      response = { message: "Not logged in" };
    } else {
      const userauth = await getUserAuthDetails(req.user.username);
      if (!userauth) {
        status = HTTP_STATUS.UNAUTHORIZED;
        response = { message: "Not logged in" };
      } else {
        const secret = decrypt(userauth.encrypted_2fa_secret);
        const otpauthUrl = speakeasy.otpauthURL({
          secret: secret,
          label: `To-Do App`,
          issuer: "To-Do App",
          encoding: "base32",
        });
        const qr = await qrcode.toDataURL(otpauthUrl);
        status = HTTP_STATUS.OK;
        response = { qr, manualCode: secret };
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
    if (!req.user || !req.user.username) {
      status = HTTP_STATUS.UNAUTHORIZED;
      response = { success: false, message: "Not logged in" };
    } else {
      const { token: userToken } = req.body;
      const userauth = await getUserAuthDetails(req.user.username);
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
          const user = await getUserByUsername(req.user.username);
          let roles = [];
          let refreshToken;
          if (user && user.id) {
            const userRoles = await getUserRolesByUserId(user.id);
            roles = userRoles.map((r) => r.role_id);
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
            username: req.user.username,
            userId: user ? user.id : undefined,
            roles,
            twoFA: true,
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
      const entry = await getRefreshToken(oldToken);
      if (!entry || !(await isRefreshTokenValid(oldToken))) {
        status = HTTP_STATUS.UNAUTHORIZED;
        response = {
          success: false,
          message: "Invalid or expired refresh token",
        };
      } else {
        const newRefreshToken = await rotateRefreshToken(oldToken, {
          userId: entry.userId,
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
        if (entry.userId) {
          user = await getUserByUsername(entry.userId);
          if (getUserById) {
            user = await getUserById(entry.userId);
          }
          if (user && user.id) {
            const userRoles = await getUserRolesByUserId(user.id);
            roles = userRoles.map((r) => r.role_id);
          }
        }
        const newToken = signJwt({
          username: user ? user.username : undefined,
          userId: user ? user.id : undefined,
          roles,
          twoFA: true,
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
  const { refreshToken } = req.body;
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }
  res.status(200).json({ success: true });
};

export { login, logout, setup2FA, verify2FA, refreshToken };

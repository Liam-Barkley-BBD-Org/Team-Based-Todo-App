import { verifyJwt } from "../utils/jwtUtil.js";
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { ROLES } from "../utils/roleConstants.js";

export function requireAccessToken(req, res, next) {
  const auth = req.headers.authorization;
  let error = null;
  if (!auth || !auth.startsWith("Bearer ")) {
    error = {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Missing or invalid token",
    };
  } else {
    const token = auth.split(" ")[1];
    const payload = verifyJwt(token);
    if (!payload) {
      error = {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Invalid or expired token",
      };
    } else {
      req.user = {
        id: payload.sub,
        roles: payload.roles,
        scope: payload.scope,
      };
    }
  }
  if (error) {
    res.status(error.status).json({ message: error.message });
  } else {
    next();
  }
}

export function requireFullAuth(req, res, next) {
  const auth = req.headers.authorization;
  let error = null;
  if (!auth || !auth.startsWith("Bearer ")) {
    error = {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Missing or invalid token",
    };
  } else {
    const token = auth.split(" ")[1];
    const payload = verifyJwt(token);
    if (!payload) {
      error = {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Invalid or expired token",
      };
    } else if (payload.scope !== "full_access") {
      error = { status: HTTP_STATUS.FORBIDDEN, message: "2FA required" };
    } else {
      req.user = {
        id: payload.sub,
        roles: payload.roles,
        scope: payload.scope,
      };
    }
  }
  if (error) {
    res.status(error.status).json({ message: error.message });
  } else {
    next();
  }
}

export function requireRole(roles) {
  return (req, res, next) => {
    let error = null;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    if (!req.user) {
      error = {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Authentication required",
      };
    } else if (
      !req.user.roles ||
      !requiredRoles.some((role) => req.user.roles.includes(role))
    ) {
      error = {
        status: HTTP_STATUS.FORBIDDEN,
        message: `Forbidden: requires one of roles: ${requiredRoles.join(
          ", "
        )}`,
      };
    }
    if (error) {
      res.status(error.status).json({ message: error.message });
    } else {
      next();
    }
  };
}

export function requireAuthSetupScope(req, res, next) {
  let error = null;
  if (!req.user) {
    error = {
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Authentication required",
    };
  } else if (req.user.scope !== "auth_setup") {
    error = {
      status: HTTP_STATUS.FORBIDDEN,
      message: "2FA setup or verification required",
    };
  }
  if (error) {
    res.status(error.status).json({ message: error.message });
  } else {
    next();
  }
}

export const requireAnyUserRole = requireRole([
  ROLES.TEAM_LEAD,
  ROLES.ACCESS_ADMIN,
  ROLES.TODO_USER,
]);

export const requireTeamLeadOrAdmin = requireRole([
  ROLES.TEAM_LEAD,
  ROLES.ACCESS_ADMIN,
]);

export const requireAdminRole = requireRole([ROLES.ACCESS_ADMIN]);

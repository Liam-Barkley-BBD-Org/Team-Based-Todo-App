import { getAllRoles, getRoleById } from '../daos/roleService.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

const getRoles = async (req, res, next) => {
  try {
    const roles = await getAllRoles();
    const status = HTTP_STATUS.OK;
    const response = roles || []; 

    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

const getRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await getRoleById(id);
    let status, response;

    if (role) {
      status = HTTP_STATUS.OK;
      response = role;
    } else {
      status = HTTP_STATUS.NOT_FOUND;
      response = { error: 'Role not found' };
    }

    res.status(status).json(response);
  } catch (error) {
    next(error);
  }
};

export { getRole, getRoles };

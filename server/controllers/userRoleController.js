import { getUserById } from '../services/userService.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

import { 
    getUserRoleByUserIdAndRoleId, 
    getUserRolesByUserId, 
    createUserRole,
    getUserRoleById, 
    removeUserRole,
} from '../services/userRoleService.js';

const getUserRoles = async (req, res, next) => {
    try {
        const { id } = req.params;
        let status, response;

        if (!(await getUserById(id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User does not exist' };
        } else {
            const userRoles = await getUserRolesByUserId(id);
            status = HTTP_STATUS.OK;
            response = userRoles || []; 
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const postUserRole = async (req, res, next) => {
    try {
        const { user_id, role_id } = req.body;
        let status, response;

        if (!(await getUserById(user_id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User does not exist' };
        } else if (await getUserRoleByUserIdAndRoleId(user_id, role_id)) {
            status = HTTP_STATUS.CONFLICT;
            response = { error: 'Cannot assign role to user' };
        } else {
            const userRole = await createUserRole({ role_id, user_id });
            status = HTTP_STATUS.CREATED;
            response = userRole;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        let status, response;

        if (!(await getUserRoleById(id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Cannot remove this role' };
        } else {
            await removeUserRole({ id });
            status = HTTP_STATUS.NO_CONTENT;
            response = {};
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

export { postUserRole, getUserRoles, deleteUserRole };

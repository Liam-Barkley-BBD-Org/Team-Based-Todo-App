import { getUserById, getUserByUsername } from '../daos/userDao.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

import {
    getUserRoleByUserIdAndRoleId,
    getUserRolesByUserId,
    createUserRole,
    removeUserRole,
} from '../daos/userRoleDao.js';
import { getRoleByName } from '../daos/roleDao.js';

const getUserRoles = async (req, res, next) => {
    try {
        const { name } = req.params;
        let status, response;

        const user = await getUserByUsername(name);
        if (!user) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else {
            const userRoles = await getUserRolesByUserId(user.id);
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
        const { username, rolename } = req.body;
        let status, response;

        const user = await getUserByUsername(username);
        const role = await getRoleByName(rolename);

        if (!user || !role) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User or role not found' };
        } else if (await getUserRoleByUserIdAndRoleId(user.id, role.id)) {
            status = HTTP_STATUS.CONFLICT;
            response = { error: 'Cannot assign role to user' };
        } else {
            const userRole = await createUserRole({ role_id: role.id, user_id: user.id });
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
        const { username, rolename } = req.body;
        const user = await getUserByUsername(username);
        const role = await getRoleByName(rolename);

        let status, response;

        if (!user || !role) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User or role not found' };
        } else {
            const userRole = await getUserRoleByUserIdAndRoleId(user.id, role.id);

            if (!userRole) {
                status = HTTP_STATUS.NOT_FOUND;
                response = { error: 'Cannot remove this role' };
            } else {
                await removeUserRole({ id: userRole.id });
                status = HTTP_STATUS.NO_CONTENT;
                response = {};
            }
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

export { postUserRole, getUserRoles, deleteUserRole };

import { getUserById, getUserByUsername } from '../daos/userDao.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

import { getTeamById, getTeamByName, getTeamsByOwnerId, createTeam } from '../daos/teamDao.js';
import { createTeamMember } from '../daos/teamMemberDao.js';

const getTeam = async (req, res, next) => {
    try {
        const { id } = req.params;
        const team = await getTeamById(id);
        const requestUserId = req.user?.id;
        let status, response;

        const membership = team && requestUserId
            ? await getTeamMemberByTeamIdAndUserId({ team_id: team.id, user_id: requestUserId })
            : null;

        if (!team) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else if (!membership) {
            status = HTTP_STATUS.FORBIDDEN;
            response = { };
        } else {
            status = HTTP_STATUS.OK;
            response = team;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const getOwnedTeams = async (req, res, next) => {
    try {
        const { name } = req.params;
        const user = await getUserByUsername(name);
        const requestUserId = req.user?.id;
        let status, response;

        if (!user) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User does not exist' };
        } else if (!requestUserId || requestUserId !== user.id) {
            status = HTTP_STATUS.FORBIDDEN;
            response = { };
        } else {
            const userTeams = await getTeamsByOwnerId(user.id);
            status = HTTP_STATUS.OK;
            response = userTeams || [];
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const postTeam = async (req, res, next) => {
    try {
        const { name, owner_username } = req.body;
        const requestUserId = req.user?.id;
        const owner = await getUserByUsername(owner_username);
        let status, response;

        if (!owner) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User does not exist' };
        } else if (requestUserId !== owner.id) {
            status = HTTP_STATUS.FORBIDDEN;
            response = { };
        } else if (await getTeamByName(name)) {
            status = HTTP_STATUS.CONFLICT;
            response = { error: 'Team name taken' };
        } else {
            const team = await createTeam({ name, owner_user_id: owner.id });
            await createTeamMember({ team_id: team.id, user_id: team.owner_user_id });
            status = HTTP_STATUS.CREATED;
            response = team;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

export { getTeam, getOwnedTeams, postTeam };

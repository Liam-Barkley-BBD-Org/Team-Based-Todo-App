import { getUserById } from '../services/userService.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";

import { getTeamById, getTeamByName, getTeamsByOwnerId, createTeam } from '../services/teamService.js';
import { createTeamMember } from '../services/teamMemberService.js';

const getTeam = async (req, res, next) => {
    try {
        const { id } = req.params;
        const team = await getTeamById(id);
        let status, response;

        if (team) {
            status = HTTP_STATUS.OK;
            response = team;
        } else {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const getOwnedTeams = async (req, res, next) => {
    try {
        const { id } = req.params;
        let status, response;

        if (!(await getUserById(id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User does not exist' };
        } else {
            const userTeams = await getTeamsByOwnerId(id);
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
        const { name, owner_user_id } = req.body;
        let status, response;

        if (!(await getUserById(owner_user_id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User does not exist' };
        } else if (await getTeamByName(name)) {
            status = HTTP_STATUS.CONFLICT;
            response = { error: 'Team name taken' };
        } else {
            const team = await createTeam({ name, owner_user_id });
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

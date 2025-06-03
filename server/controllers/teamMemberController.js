import { getUserById } from '../services/userService.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { getTeamById } from '../services/teamService.js';

import { 
    getTeamMemberById,
    getMembersByTeamId, 
    getTeamsByUserId, 
    createTeamMember,
    removeTeamMember,
    getTeamMemberByTeamIdAndUserId,
} from '../services/teamMemberService.js';

const getUserTeams = async (req, res, next) => {
    try {
        const { id } = req.params;
        let status, response;

        if (!(await getUserById(id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else {
            const userTeams = await getTeamsByUserId(id);
            status = HTTP_STATUS.OK;
            response = userTeams || []; 
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const getTeamMembers = async (req, res, next) => {
    try {
        const { id } = req.params;
        let status, response;

        if (!(await getTeamById(id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else {
            const teamMembers = await getMembersByTeamId(id);
            status = HTTP_STATUS.OK;
            response = teamMembers || []; 
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const postTeamMember = async (req, res, next) => {
    try {
        const { team_id, user_id } = req.body;
        let status, response;

        if (!(await getUserById(user_id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else if (!(await getTeamById(team_id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else if (await getTeamMemberByTeamIdAndUserId({ team_id, user_id })) {
            status = HTTP_STATUS.CONFLICT;
            response = { error: 'Could not add user to team' }
        } else {
            const team = await createTeamMember({ team_id, user_id });
            status = HTTP_STATUS.CREATED;
            response = team;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteTeamMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        let status, response;

        if (!(await getTeamMemberById(id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team member not found' };
        } else {
            await removeTeamMember({ id });
            status = HTTP_STATUS.NO_CONTENT;
            response = {};
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

export { getUserTeams, getTeamMembers, postTeamMember, deleteTeamMember };

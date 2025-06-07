import { getUserById } from '../daos/userDao.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { getTeamById } from '../daos/teamDao.js';

import { 
    getTeamMemberById,
    getMembersByTeamId, 
    getTeamsByUserId, 
    createTeamMember,
    removeTeamMember,
    getTeamMemberByTeamIdAndUserId,
} from '../daos/teamMemberDao.js';

const getUserTeams = async (req, res, next) => {
    try {
        const { id: user_id } = req.params;
        let status, response;

        const user = await getUserById(user_id);
        if (!user) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else {
            const userTeams = await getTeamsByUserId(user_id);
            const mappedUserTeams = await Promise.all(
                userTeams.map(async (membership) => {
                    const team = await getTeamById(membership.team_id);
                    return {
                        ...membership,
                        user,
                        team,
                    };
                })
            );

            status = HTTP_STATUS.OK;
            response = mappedUserTeams;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};


const getTeamMembers = async (req, res, next) => {
    try {
        const { id: team_id } = req.params;
        let status, response;

        const team = await getTeamById(team_id);
        if (!team) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else {
            const teamMembers = await getMembersByTeamId(team_id);

            const mappedTeamMembers = await Promise.all(
                teamMembers.map(async (member) => {
                    const user = await getUserById(member.user_id);
                    return {
                        ...member,
                        user,
                        team
                    };
                })
            );

            status = HTTP_STATUS.OK;
            response = mappedTeamMembers;
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
        const teamMember = await getTeamMemberById(id);
        let status, response;

        if (!teamMember) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team member not found' };
        } else {
            const team = await getTeamById(teamMember.team_id);

            if (teamMember.user_id == team.owner_user_id) {
                status = HTTP_STATUS.BAD_REQUEST;
                response = { error: 'Cannot remove team member' };
            } else {
                await removeTeamMember({ id });
                status = HTTP_STATUS.NO_CONTENT;
                response = {};
            }
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

export { getUserTeams, getTeamMembers, postTeamMember, deleteTeamMember };

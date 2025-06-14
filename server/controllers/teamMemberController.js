import { getUserById, getUserByUsername } from '../daos/userDao.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { getTeamById, getTeamByName } from '../daos/teamDao.js';

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
        const { name: username } = req.params;
        let status, response;

        const user = await getUserByUsername(username);
        if (!user) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else {
            const userTeams = await getTeamsByUserId(user.id);
            const mappedUserTeams = await Promise.all(
                userTeams.map(async (membership) => {
                    const team = await getTeamById(membership.team_id);
                    return {
                        id: membership.id,
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
        const { name } = req.params;
        let status, response;

        const team = await getTeamByName(name);
        if (!team) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else {
            const teamMembers = await getMembersByTeamId(team.id);

            const mappedTeamMembers = await Promise.all(
                teamMembers.map(async (member) => {
                    const user = await getUserById(member.user_id);
                    return {
                        id: member.id,
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
        const { username, teamname } = req.body;
        const user = await getUserByUsername(username);
        const team = await getTeamByName(teamname);
        let status, response;

        if (!user || !team) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User or team not found' };
        } else if (await getTeamMemberByTeamIdAndUserId({ team_id: team.id, user_id: user.id })) {
            status = HTTP_STATUS.CONFLICT;
            response = { error: 'Could not add user to team' }
        } else {
            let teamMember = await createTeamMember({ team_id: team.id, user_id: user.id });
            status = HTTP_STATUS.CREATED;
            response = teamMember;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteTeamMember = async (req, res, next) => {
    try {
        const { username, teamname } = req.body;
        const user = await getUserByUsername(username);
        const team = await getTeamByName(teamname);
        let status, response;

        if (!user || !team) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User or team not found' };
        } else {
            const teamMember = await getTeamMemberByTeamIdAndUserId({ team_id: team.id, user_id: user.id });

            if (!teamMember) {
                status = HTTP_STATUS.NOT_FOUND;
                response = { error: 'Team member not found' };
            } else if (teamMember.user_id == team.owner_user_id) {
                status = HTTP_STATUS.BAD_REQUEST;
                response = { error: 'Cannot remove team member' };
            } else {
                await removeTeamMember({ user_id: user.id, team_id: team.id });
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

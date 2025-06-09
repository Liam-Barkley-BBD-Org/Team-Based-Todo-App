import { getUserById, getUserByUsername } from '../daos/userDao.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { getTeamById, getTeamByName } from '../daos/teamDao.js';
import { createTodoSnapshot, getTodoSnapshotsByTodoIdAndFromDate } from '../daos/todoSnapshotDao.js';
import { getTeamMemberByTeamIdAndUserId } from '../daos/teamMemberDao.js';

import {
    getTodoById,
    getTodosByTeamId,
    getAllTodosByUserId,
    getOwnedTodosByUserId,
    getAssignedTodosByUserId,
    updateTodo,
    createTodo,
    softDeleteTodo,
} from '../daos/todoDao.js';

const getTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const todo = await getTodoById(id);
        let status, response;

        if (todo) {
            const assignedUser = todo.assigned_user_id
                ? await getUserById(todo.assigned_user_id)
                : null;

            const creator = await getUserById(todo.created_by_user_id);

            const team = todo.team_id
                ? await getTeamById(todo.team_id)
                : null;

            status = HTTP_STATUS.OK;
            response = {
                ...todo,
                team,
                created_by_user: creator,
                assigned_user: assignedUser
            };
        } else {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Todo not found' };
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const getTeamTodos = async (req, res, next) => {
    try {
        const { name } = req.params;
        let status, response;

        const team = await getTeamByName(name);
        if (!team) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else {
            const todos = await getTodosByTeamId(team.id);

            const mappedTodos = await Promise.all(
                todos.map(async (todo) => {
                    const assignedUser = todo.assigned_user_id
                        ? await getUserById(todo.assigned_user_id)
                        : null;

                    return {
                        ...todo,
                        assigned_user: assignedUser
                    };
                })
            );

            status = HTTP_STATUS.OK;
            response = mappedTodos;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const getUserTodos = async (req, res, next) => {
    try {
        const { name } = req.params;
        const { role } = req.query;
        let status, response;

        const user = await getUserByUsername(name);
        if (!user) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else {
            let todos;
            switch (role) {
                case 'assigned':
                    todos = await getAssignedTodosByUserId(user.id);
                    break;
                case 'owned':
                    todos = await getOwnedTodosByUserId(user.id);
                    break;
                default:
                    todos = await getAllTodosByUserId(user.id);
            }

            const mappedTodos = await Promise.all(
                todos.map(async (todo) => {
                    const team = await getTeamById(todo.team_id);

                    const assignedUser = todo.assigned_user_id
                        ? await getUserById(todo.assigned_user_id)
                        : null;

                    return {
                        ...todo,
                        team,
                        assigned_user: assignedUser
                    };
                })
            );

            status = HTTP_STATUS.OK;
            response = mappedTodos;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const getTodoReport = async (req, res, next) => {
    try {
        const { name } = req.params;
        const { period, n } = req.query;
        let status, response;

        const now = new Date();
        let fromDate = new Date(now);

        switch (period) {
            case 'weeks':
                fromDate.setDate(now.getDate() - 7 * n);
                break;
            case 'months':
                fromDate.setMonth(now.getMonth() - n);
                break;
            case 'years':
                fromDate.setFullYear(now.getFullYear() - n);
                break;
        }

        const team = await getTeamByName(name);

        if (!team) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else {
            const todos = await getTodosByTeamId(team.id);

            const breakdown = {
                open: [],
                closed: [],
            };

            for (const todo of todos) {
                const snapshots = await getTodoSnapshotsByTodoIdAndFromDate(todo.id, fromDate.toISOString());

                const timelineEntry = {
                    todo,
                    snapshots,
                };

                if (todo.is_open) {
                    breakdown.open.push(timelineEntry);
                } else {
                    breakdown.closed.push(timelineEntry);
                }
            }

            status = HTTP_STATUS.OK;
            response = breakdown;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const patchTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, is_open, assigned_to_username } = req.body;
        const todo = await getTodoById(id);
        let status, response;

        const fields = {};
        if (title !== undefined) fields.title = title;
        if (description !== undefined) fields.description = description;
        if (is_open !== undefined) fields.is_open = is_open;

        let assignedToUser = null;
        let assignedToUserValid = true;

        if (assigned_to_username !== undefined) {
            assignedToUser = assigned_to_username ? await getUserByUsername(assigned_to_username) : null;
            if (assigned_to_username && !assignedToUser) {
                assignedToUserValid = false;
            } else {
                fields.assigned_user_id = assignedToUser ? assignedToUser.id : null;
            }
        }

        if (Object.keys(fields).length === 0) {
            status = HTTP_STATUS.BAD_REQUEST;
            response = { error: 'No fields provided' };
        } else if (!todo) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Todo not found' };
        } else if (!assignedToUserValid) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else if (
            assignedToUser && !(await getTeamMemberByTeamIdAndUserId({ team_id: todo.team_id, user_id: assignedToUser.id }))) {
            status = HTTP_STATUS.BAD_REQUEST;
            response = { error: 'Cannot assign to this user' };
        } else {
            const updated = await updateTodo(id, fields);

            await createTodoSnapshot({
                todo_id: updated.id,
                snapshot_at: new Date().toISOString(),
                is_open: updated.is_open,
                assigned_user_id: updated.assigned_user_id
            });

            status = HTTP_STATUS.OK;
            response = updated;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const postTodo = async (req, res, next) => {
    try {
        const { title, description, created_at, created_by_username, teamname, assigned_to_username } = req.body;
        const createdByUser = await getUserByUsername(created_by_username);
        const assignedToUser = assigned_to_username ? await getUserByUsername(assigned_to_username) : null;
        const team = await getTeamByName(teamname);
        let status, response;

        if (!createdByUser) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else if (assigned_to_username && !assignedToUser) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else if (!team) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else if (assignedToUser && !(await getTeamMemberByTeamIdAndUserId({ team_id: team.id, user_id: assignedToUser.id }))) {
            status = HTTP_STATUS.BAD_REQUEST;
            response = { error: 'Cannot assign to this user' };
        } else {
            const is_open = true;
            const todo = await createTodo({
                title,
                description,
                created_at,
                created_by_user_id: createdByUser.id,
                team_id: team.id,
                is_open,
                assigned_user_id: assignedToUser ? assignedToUser.id : null
            });

            await createTodoSnapshot({
                todo_id: todo.id,
                snapshot_at: new Date().toISOString(),
                is_open: todo.is_open,
                assigned_user_id: todo.assigned_user_id
            });

            status = HTTP_STATUS.CREATED;
            response = todo;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        let status, response;

        if (!(await getTodoById(id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Todo not found' };
        } else {
            const deleted = await softDeleteTodo(id);
            status = HTTP_STATUS.OK;
        }

        res.status(status).json();
    } catch (error) {
        next(error);
    }
};

export { getTodo, getTeamTodos, getUserTodos, getTodoReport, patchTodo, postTodo, deleteTodo };

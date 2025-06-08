import { getUserById } from '../daos/userDao.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { getTeamById } from '../daos/teamDao.js';
import { createTodoSnapshot } from '../daos/todoSnapshotDao.js';

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
        const { id } = req.params;
        let status, response;

        const team = await getTeamById(id);
        if (!team) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else {
            const todos = await getTodosByTeamId(id);

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
        const { id } = req.params;
        const { role } = req.query;
        let status, response;

        const user = await getUserById(id);
        if (!user) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else {
            let todos;
            switch (role) {
                case 'assigned':
                    todos = await getAssignedTodosByUserId(id);
                    break;
                case 'owned':
                    todos = await getOwnedTodosByUserId(id);
                    break;
                default:
                    todos = await getAllTodosByUserId(id);
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

const patchTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, is_open, assigned_user_id } = req.body;
        let status, response;

        const fields = {};
        if (title !== undefined) fields.title = title;
        if (description !== undefined) fields.description = description;
        if (is_open !== undefined) fields.is_open = is_open;
        if (assigned_user_id !== undefined) fields.assigned_user_id = assigned_user_id;

        if (Object.keys(fields).length === 0) {
            status = HTTP_STATUS.BAD_REQUEST;
            response = { error: 'No fields provided' };
        } else if (!(await getTodoById(id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Todo not found' };
        } else if (assigned_user_id && !(await getTeamMemberByTeamIdAndUserId({ team_id: team_id, user_id: assigned_user_id }))) {
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
        const { title, description, created_at, created_by_user_id, team_id, assigned_user_id } = req.body;
        let status, response;

        if (!(await getUserById(created_by_user_id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };
        } else if (assigned_user_id && !(await getUserById(assigned_user_id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'User not found' };          
        } else if (!(await getTeamById(team_id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else if (assigned_user_id && !(await getTeamMemberByTeamIdAndUserId({ team_id: team_id, user_id: assigned_user_id }))) {
            status = HTTP_STATUS.BAD_REQUEST;
            response = { error: 'Cannot assign to this user' }; 
        } else {
            const is_open = true;
            const todo = await createTodo({ title, description, created_at, created_by_user_id, team_id, is_open, assigned_user_id });

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

export { getTodo, getTeamTodos, getUserTodos, patchTodo, postTodo, deleteTodo };

import { getUserById } from '../services/userService.js';
import { HTTP_STATUS } from "../utils/httpStatusUtil.js";
import { getTeamById } from '../services/teamService.js';

import { 
    getTodoById,
    getTodosByTeamId,
    getAllTodosByUserId,
    getOwnedTodosByUserId,
    getAssignedTodosByUserId,
    updateTodo,
    createTodo,
} from '../services/todoService.js';

const getTodo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const todo = await getTodoById(id);
        let status, response;

        if (todo) {
            status = HTTP_STATUS.OK;
            response = todo;
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

        if (!(await getTeamById(id))) {
            status = HTTP_STATUS.NOT_FOUND;
            response = { error: 'Team not found' };
        } else {
            const teamTodos = await getTodosByTeamId(id);
            status = HTTP_STATUS.OK;
            response = teamTodos || []; 
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

        if (!(await getUserById(id))) {
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
            status = HTTP_STATUS.OK;
            response = todos || []; 
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
        } else {
            if (!(await getTodoById(id))) {
                status = HTTP_STATUS.NOT_FOUND;
                response = { error: 'Todo not found' };
            } else {
                const updated = await updateTodo(id, fields);
                status = HTTP_STATUS.OK;
                response = updated; 
            }
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
        } else {
            const is_open = true;
            const todo = await createTodo({ title, description, created_at, created_by_user_id, team_id, is_open, assigned_user_id });
            status = HTTP_STATUS.CREATED;
            response = todo;
        }

        res.status(status).json(response);
    } catch (error) {
        next(error);
    }
};

export { getTodo, getTeamTodos, getUserTodos, patchTodo, postTodo };

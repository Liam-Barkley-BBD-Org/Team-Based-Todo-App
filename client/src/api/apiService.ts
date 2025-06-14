import type { NewTodoPayload, Todo, UpdateTodoPayload, TodoReportPeriod, UserRole, Team, TodoReport, FinalAuthResponse, LoginPayload, TempAuthResponse, TeamMembership, RegisterPayload, RegisterResponse, Setup2FAResponse } from "../type/api.types";
import apiClient from './apiClient';

const authApi = {
    login: (payload: LoginPayload): Promise<TempAuthResponse> =>
        apiClient.post<TempAuthResponse>('/auth/login', payload).then(res => res.data),

    verify2fa: (twoFactorCode: string, tempToken: string): Promise<FinalAuthResponse> =>
        apiClient.post<FinalAuthResponse>('/auth/2fa/verify',
            { token: twoFactorCode },
            {
                headers: {
                    Authorization: `Bearer ${tempToken}`
                }
            }
        ).then(res => res.data),
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },
    register: (payload: RegisterPayload): Promise<RegisterResponse> =>
        apiClient.post<RegisterResponse>('/auth/register', payload).then(res => res.data),

    setup2fa: (tempToken: string): Promise<Setup2FAResponse> =>
        apiClient.post<Setup2FAResponse>('/auth/2fa/setup', {}, {
            headers: { Authorization: `Bearer ${tempToken}` }
        }).then(res => res.data),
};


const todoApi = {
    createTodo: (payload: NewTodoPayload): Promise<Todo> => apiClient.post<Todo>('/todos/', payload).then(res => res.data),
    getTodoById: (todoId: number): Promise<Todo> => apiClient.get<Todo>(`/todos/${todoId}`).then(res => res.data),
    updateTodo: (todoId: number, payload: UpdateTodoPayload): Promise<Todo> => apiClient.patch<Todo>(`/todos/${todoId}`, payload).then(res => res.data),
    deleteTodo: (todoId: number): Promise<void> => apiClient.delete(`/todos/${todoId}`),
    getTodosForTeam: (teamName: string): Promise<Todo[]> => apiClient.get<Todo[]>(`/todos/team/${teamName}`).then(res => res.data),
    getTodosForUser: (username: string, role: 'assigned' | 'owned' | 'all'): Promise<Todo[]> => apiClient.get<Todo[]>(`/todos/user/${username}`, { params: { role } }).then(res => res.data),
    getTodoReportForTeam: (teamName: string, period: TodoReportPeriod, n: number): Promise<TodoReport> => apiClient.get<TodoReport>(`/todos/report/team/${teamName}`, { params: { period, n } }).then(res => res.data),
};

const userRoleApi = {
    assignRoleToUser: (username: string, rolename: UserRole['rolename']): Promise<void> => apiClient.post('/user_roles/', { username, rolename }),
    getRolesForUser: (username: string): Promise<UserRole[]> => apiClient.get<UserRole[]>(`/user_roles/user/${username}`).then(res => res.data),
    deleteUserRole: (username: string, rolename: UserRole['rolename']): Promise<void> => apiClient.delete('/user_roles/', { data: { username, rolename } }),
};

const teamApi = {
    createTeam: (name: string, owner_username: string): Promise<Team> => apiClient.post<Team>('/teams/', { name, owner_username }).then(res => res.data),
    addUserToTeam: (username: string, teamname: string): Promise<void> => apiClient.post('/team_members/', { username, teamname }),
    getUsersInTeam: (teamName: string): Promise<TeamMembership[]> =>
        apiClient.get<TeamMembership[]>(`/team_members/team/${teamName}`).then(res => res.data),
    removeUserFromTeam: (teamname: string, username: string): Promise<void> => apiClient.delete('/team_members/', { data: { teamname, username } }),
};

const generalApi = {
    getUserByName: (name: string): Promise<{ user_id: number }> => apiClient.get<{ user_id: number }>(`/users/${name}`).then(res => res.data),
    getTeamsForUser: (name: string): Promise<TeamMembership[]> =>
        apiClient.get<TeamMembership[]>(`/team_members/user/${name}`).then(res => res.data),
};

export const apiService = {
    todos: todoApi,
    roles: userRoleApi,
    teams: teamApi,
    users: generalApi,
    auth: authApi,
};
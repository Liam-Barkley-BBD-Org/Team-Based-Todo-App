export interface Todo {
  todoId: number;
  title: string;
  description: string;
  created_at: string; // ISO date string
  created_by_username: string;
  teamname: string;
  assigned_to_username: string | null;
  is_open: boolean;
}

export interface NewTodoPayload {
  title: string;
  description: string;
  created_at: string;
  created_by_username: string;
  teamname: string;
  assigned_to_username?: string | null;
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  is_open?: boolean;
  assigned_to_username?: string | null;
}

export interface Team {
  name: string;
  owner_username: string;
}

export interface UserRole {
  username: string;
  rolename: 'TODO_USER' | 'ACCESS_ADMIN' | 'TEAM_LEAD';
}

export type TodoReportPeriod = 'weeks' | 'months' | 'years';
export type TodoReport = object
export interface UserSummary {
    id: number;
    username: string;
}

export interface TeamDetail {
    id: number;
    name: string;
    owner_user_id: number;
}

export interface Todo {
    id: number;
    title: string;
    description: string;
    is_open: boolean;
    created_at: string; 
    deleted_at: string | null;
    
    team: TeamDetail;
    created_by_user: UserSummary;
    assigned_to_user: UserSummary | null;

    team_id: number;
    created_by_user_id: number;
    assigned_user_id: number | null;
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
  id: string,
  name: string;
  owner_username: string;
}

export interface UserRole {
  username: string;
  rolename: 'TODO_USER' | 'ACCESS_ADMIN' | 'TEAM_LEAD';
}


export interface LoginPayload {
  username: string;
  password: string;
}

export interface TempAuthResponse {
  success: boolean;
  message: string;
  token: string;
  needs2FASetup: boolean;
}

export interface FinalAuthResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface TeamDetail {
    id: number;
    name: string;
    owner_user_id: number;
}

export interface UserSummary {
    id: number;
    username: string;
}

export interface TeamMembership {
    id: number;
    user: UserSummary;
    team: TeamDetail;
}

export interface RegisterPayload {
  username: string;
  password: string;
}
export interface RegisterResponse {
  tempToken: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: UserSummary;
  token: string;
}

export interface Setup2FAResponse {
  success: boolean;
  message: string;
  qr: string;
  manualCode: string;
}

export type TodoReportPeriod = 'weeks' | 'months' | 'years';
export type TodoReport = object
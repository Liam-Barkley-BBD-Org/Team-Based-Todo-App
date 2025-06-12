const API_BASE_URL = "/api";

interface DashboardTask {
  id: number;
  title: string;
  status: "open" | "in-progress" | "completed";
  assignee: string; 
  team: string;  
  dueDate: string;
  description?: string;
  created_at?: string;
  created_by_user_id?: number;
  team_id?: number;
  assigned_user_id?: number | null;
  is_open?: boolean;
}


async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    let errorDetails = `Status: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorDetails += `, Body: ${JSON.stringify(errorBody)}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) { /* empty */ }
    throw new Error(`API request to ${endpoint} failed: ${errorDetails}`);
  }
  return response.json() as Promise<T>;
}

export const getTeamsForUser = (userId: number) =>
  request<unknown[]>(`/team_members/user/${userId}`);

export const getTodosForTeam = (teamId: number) =>
  request<DashboardTask[]>(`/todos/team/${teamId}`);

export const getUserTodos = (userId: number, role: 'assigned' | 'owned' | 'all' = 'all') =>
  request<DashboardTask[]>(`/todos/user/${userId}?role=${role}`);

// // --- Todo CRUD ---
// export const createTodo = (todoData: { /* ...todo create params... */ }) =>
//   request<DashboardTask>(`/todos/`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(todoData),
//   });

export const getTodoById = (todoId: number) =>
  request<DashboardTask>(`/todos/${todoId}`);

// export const updateTodo = (todoId: number, todoData: Partial<{ /* ...todo update params... */ }>) =>
//   request<DashboardTask>(`/todos/${todoId}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(todoData),
//   });

export const deleteTodo = (todoId: number) =>
  request<void>(`/todos/${todoId}`, { method: 'DELETE' });
import { jwtDecode } from 'jwt-decode';
import { tokenManager } from '../api/tokenManager';

export type UserRoleType = 'TODO_USER' | 'ACCESS_ADMIN' | 'TEAM_LEAD';
interface DecodedToken {
  username: string;
  roles: UserRoleType[];
}

type AuthHookReturn = {
  isAuthenticated: boolean;
  user: { username:string } | null;
  roles: UserRoleType[];
};

export const useAuth = (): AuthHookReturn => {
  const token = tokenManager.getToken();
  const storedUsername = localStorage.getItem('username');


  if (!token) {
    return { isAuthenticated: false, user: null, roles: []};
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return {
      isAuthenticated: true,
      user: { username: storedUsername },
      roles: decoded.roles || [],
    };
  } catch (error) {
    return { isAuthenticated: false, user: null, roles: [] };
  }
};
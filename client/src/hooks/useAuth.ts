import { jwtDecode } from 'jwt-decode';
import { tokenManager } from '../api/tokenManager';

interface DecodedToken {
  username: string;
  roles: ('TODO_USER' | 'ACCESS_ADMIN' | 'TEAM_LEAD')[];
}

export const useAuth = () => {
  const token = tokenManager.getToken();

  if (!token) {
    return { isAuthenticated: false, user: null, roles: [] };
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return {
      isAuthenticated: true,
      user: { username: decoded.username },
      roles: decoded.roles || [],
    };
  } catch (error) {
    return { isAuthenticated: false, user: null, roles: [] };
  }
};
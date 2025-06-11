import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, type UserRoleType } from '../hooks/useAuth';

interface ProtectedRouteProps {
  requiredRole?: UserRoleType;
}

export function AuthProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, roles } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
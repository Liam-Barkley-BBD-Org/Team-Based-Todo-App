import React from "react";
import { Navigate } from "react-router-dom";
import { useUserRoles } from "../hooks/useUserRoles";
import { hasTeamLeaderRole } from "../utils/roleUtil";

interface ProtectedRouteProps {
    userId: string;
    requiredRole: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    userId,
    requiredRole,
    children,
}) => {
    const { roles, loading, error } = useUserRoles(userId);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const hasAccess =
        requiredRole === "Team Leader" ? hasTeamLeaderRole(roles) : false;

    return hasAccess ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export default ProtectedRoute;

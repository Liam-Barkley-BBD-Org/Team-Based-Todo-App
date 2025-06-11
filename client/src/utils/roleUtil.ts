export const hasTeamLeaderRole = (roles: { role_id: number; role_name?: string }[]): boolean => {
    return roles.some(role => role.role_name === 'Team Leader');
}
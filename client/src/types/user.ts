export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'team_member' | 'team_leader';
    department: string;
    joinedDate: string;
    lastActive: string;
    status: 'active' | 'inactive';
}

export interface RoleChangeEvent {
    userId: string;
    newRole: User['role'];
    previousRole: User['role'];
}
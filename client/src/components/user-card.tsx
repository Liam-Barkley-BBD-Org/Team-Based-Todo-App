import React from 'react';
import { User, Crown, Users, Calendar, Clock, MoreVertical } from 'lucide-react';
import type { User as UserType } from '../types/user';

interface UserCardProps {
    user: UserType;
    onRoleChange: (userId: string, newRole: UserType['role']) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onRoleChange }) => {
    const handleRoleToggle = () => {
        const newRole = user.role === 'team_member' ? 'team_leader' : 'team_member';
        onRoleChange(user.id, newRole);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getRoleIcon = () => {
        return user.role === 'team_leader' ? (
            <Crown className="h-4 w-4 text-amber-500" />
        ) : (
            <Users className="h-4 w-4 text-blue-500" />
        );
    };

    const getRoleBadge = () => {
        const isLeader = user.role === 'team_leader';
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${isLeader
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
            >
                {getRoleIcon()}
                {isLeader ? 'Team Leader' : 'Team Member'}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                    <div className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {formatDate(user.joinedDate)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Last active {formatDate(user.lastActive)}
                </div>
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Department:</span> {user.department}
                </div>
            </div>

            <div className="flex items-center justify-between">
                {getRoleBadge()}
                <button
                    onClick={handleRoleToggle}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${user.role === 'team_leader'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                >
                    {user.role === 'team_leader' ? 'Demote to Member' : 'Promote to Leader'}
                </button>
            </div>
        </div>
    );
};
import React from 'react';
import { Crown, Users, UserCheck, UserX } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, subtitle }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

interface StatsOverviewProps {
    totalUsers: number;
    teamLeaders: number;
    teamMembers: number;
    activeUsers: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
    totalUsers,
    teamLeaders,
    teamMembers,
    activeUsers,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
                title="Total Users"
                value={totalUsers}
                icon={<Users className="h-6 w-6 text-white" />}
                color="bg-blue-500"
                subtitle="All team members"
            />
            <StatsCard
                title="Team Leaders"
                value={teamLeaders}
                icon={<Crown className="h-6 w-6 text-white" />}
                color="bg-amber-500"
                subtitle="Leadership roles"
            />
            <StatsCard
                title="Team Members"
                value={teamMembers}
                icon={<Users className="h-6 w-6 text-white" />}
                color="bg-green-500"
                subtitle="Regular members"
            />
            <StatsCard
                title="Active Users"
                value={activeUsers}
                icon={<UserCheck className="h-6 w-6 text-white" />}
                color="bg-purple-500"
                subtitle="Currently active"
            />
        </div>
    );
};
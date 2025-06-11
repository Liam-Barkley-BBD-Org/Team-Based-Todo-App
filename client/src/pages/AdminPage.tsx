import React, { useState, useMemo } from 'react';
import { Shield } from 'lucide-react';
import type { User } from '../types/user';
import { UserCard } from '../components/user-card';
import { SearchAndFilter } from '../components/search-and-filter';
import { StatsOverview } from '../components/stats-card';
import { Toast } from '../components/toast';

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'team_leader',
        department: 'Engineering',
        joinedDate: '2023-01-15',
        lastActive: '2024-12-20',
        status: 'active',
    },
    {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        role: 'team_member',
        department: 'Design',
        joinedDate: '2023-03-22',
        lastActive: '2024-12-19',
        status: 'active',
    },
    {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        role: 'team_leader',
        department: 'Marketing',
        joinedDate: '2022-11-08',
        lastActive: '2024-12-20',
        status: 'active',
    },
    {
        id: '4',
        name: 'David Thompson',
        email: 'david.thompson@company.com',
        role: 'team_member',
        department: 'Engineering',
        joinedDate: '2023-07-10',
        lastActive: '2024-12-18',
        status: 'active',
    },
    {
        id: '5',
        name: 'Lisa Wang',
        email: 'lisa.wang@company.com',
        role: 'team_member',
        department: 'Sales',
        joinedDate: '2023-09-05',
        lastActive: '2024-12-15',
        status: 'inactive',
    },
    {
        id: '6',
        name: 'James Miller',
        email: 'james.miller@company.com',
        role: 'team_leader',
        department: 'Operations',
        joinedDate: '2022-08-20',
        lastActive: '2024-12-20',
        status: 'active',
    },
    {
        id: '7',
        name: 'Anna Kowalski',
        email: 'anna.kowalski@company.com',
        role: 'team_member',
        department: 'HR',
        joinedDate: '2023-12-01',
        lastActive: '2024-12-19',
        status: 'active',
    },
    {
        id: '8',
        name: 'Robert Kim',
        email: 'robert.kim@company.com',
        role: 'team_member',
        department: 'Finance',
        joinedDate: '2023-04-18',
        lastActive: '2024-12-17',
        status: 'active',
    },
];

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'team_member' | 'team_leader'>('all');
    const [statusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [toast, setToast] = useState({ isVisible: false, message: '' });

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    const stats = useMemo(() => {
        const totalUsers = users.length;
        const teamLeaders = users.filter(user => user.role === 'team_leader').length;
        const teamMembers = users.filter(user => user.role === 'team_member').length;
        const activeUsers = users.filter(user => user.status === 'active').length;

        return { totalUsers, teamLeaders, teamMembers, activeUsers };
    }, [users]);

    const handleRoleChange = (userId: string, newRole: User['role']) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            )
        );

        const user = users.find(u => u.id === userId);
        if (user) {
            const action = newRole === 'team_leader' ? 'promoted to' : 'demoted to';
            const roleText = newRole === 'team_leader' ? 'Team Leader' : 'Team Member';
            setToast({
                isVisible: true,
                message: `${user.name} ${action} ${roleText}`,
            });
        }
    };

    const closeToast = () => {
        setToast({ isVisible: false, message: '' });
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">User Roles Admin</h1>
                    </div>
                    <p className="text-gray-600">Manage team member roles and permissions</p>
                </header>

                {/* Stats Overview */}
                <section aria-label="Team statistics">
                    <StatsOverview {...stats} />
                </section>

                {/* Search and Filter */}
                <section aria-label="Search and filter users" className="mt-6">
                    <SearchAndFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        roleFilter={roleFilter}
                        onRoleFilterChange={setRoleFilter}
                    />
                </section>

                {/* Results Header */}
                <header className="flex items-center justify-between mb-6 mt-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Team Members ({filteredUsers.length})
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {searchTerm && `Showing results for "${searchTerm}"`}
                            {roleFilter !== 'all' && ` • ${roleFilter.replace('_', ' ')} only`}
                            {statusFilter !== 'all' && ` • ${statusFilter} users only`}
                        </p>
                    </div>
                </header>

                {/* User Grid */}
                {filteredUsers.length > 0 ? (
                    <section
                        aria-label="User cards"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredUsers.map(user => (
                            <article key={user.id}>
                                <UserCard user={user} onRoleChange={handleRoleChange} />
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className="text-center py-12" aria-label="No users found">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Try adjusting your search criteria or filters to find the users you're looking for.
                        </p>
                    </section>
                )}

                {/* Toast Notification */}
                <aside aria-live="polite" aria-atomic="true">
                    <Toast message={toast.message} isVisible={toast.isVisible} onClose={closeToast} />
                </aside>
            </section>
        </main>
    );
}

export default AdminPage;
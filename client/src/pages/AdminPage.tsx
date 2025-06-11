import React, { useState, useMemo } from 'react';
import { Shield, Settings, UserPlus } from 'lucide-react';
import type { User } from '../types/user';
import { UserCard } from '../components/user-card';
import { SearchAndFilter } from '../components/search-and-filter';
import { StatsOverview } from '../components/stats-card';
import { Toast } from '../components/toast';
// import { v4 as uuidv4 } from 'uuid'; // for generating unique IDs

export const mockUsers: User[] = [/* your mock data here */];

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'team_member' | 'team_leader'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [toast, setToast] = useState({ isVisible: false, message: '' });

    // Add user form state
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        role: 'team_member',
        department: '',
        status: 'active',
    });

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase())
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
                message: `${user.username} ${action} ${roleText}`,
            });
        }
    };

    const handleAddUser = () => {
        const { username, email, role, department, status } = newUser;
        if (!username) {
            setToast({ isVisible: true, message: 'Please complete all required fields' });
            return;
        }

        const newUserObj: User = {
            id: "",
            username,
            role: role as User['role'],
            joinedDate: new Date().toISOString().split('T')[0],
            status: status as User['status'],
        };

        setUsers(prev => [...prev, newUserObj]);
        setToast({ isVisible: true, message: `Added ${name} as ${role.replace('_', ' ')}` });

        // Clear form
        setNewUser({ username: '', email: '', role: 'team_member', department: '', status: 'active' });
    };

    const closeToast = () => setToast({ isVisible: false, message: '' });

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

                {/* Stats */}
                <StatsOverview {...stats} />

                {/* Search/Filter */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    roleFilter={roleFilter}
                    onRoleFilterChange={setRoleFilter}
                />

                {/* Add User Form */}
                <section className="mt-10">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <UserPlus size={20} />
                        Add New User
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Username"
                            className="border p-2 rounded"
                            value={newUser.username}
                            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        <select
                            className="border p-2 rounded"
                            value={newUser.role}
                            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="team_member">Team Member</option>
                            <option value="team_leader">Team Leader</option>
                        </select>
                        <select
                            className="border p-2 rounded"
                            value={newUser.status}
                            onChange={e => setNewUser({ ...newUser, status: e.target.value })}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button
                            onClick={handleAddUser}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Add User
                        </button>
                    </div>
                </section>

                {/* User List */}
                <section className="mt-8">
                    <header className="flex items-center justify-between mb-6">
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

                    {filteredUsers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map(user => (
                                <UserCard key={user.id} user={user} onRoleChange={handleRoleChange} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Try adjusting your search criteria or filters.
                            </p>
                        </div>
                    )}
                </section>

                {/* Toast */}
                <Toast message={toast.message} isVisible={toast.isVisible} onClose={closeToast} />
            </section>
        </main>
    );
};

export default AdminPage;
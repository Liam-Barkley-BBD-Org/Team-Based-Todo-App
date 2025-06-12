import React from 'react';
import { Search } from 'lucide-react';

interface SearchAndFilterProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    roleFilter: 'all' | 'team_member' | 'team_leader';
    onRoleFilterChange: (filter: 'all' | 'team_member' | 'team_leader') => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchTerm,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <select
                        value={roleFilter}
                        onChange={(e) => onRoleFilterChange(e.target.value as any)}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
                    >
                        <option value="all">All Roles</option>
                        <option value="team_member">Team Members</option>
                        <option value="team_leader">Team Leaders</option>
                    </select>

                </div>
            </div>
        </div>
    );
};
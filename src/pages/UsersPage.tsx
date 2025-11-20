// src/pages/UsersPage.tsx
import React, { useState } from 'react';
import { Users, Filter, Download } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import UsersTable from '../components/users/UsersTable';
import { UserFilterType } from '../types/index';

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<UserFilterType>('all');
  const [usersCount, setUsersCount] = useState<number>(0);

  const filterTabs = [
    { id: 'all' as UserFilterType, label: 'All Users' },
    { id: 'active' as UserFilterType, label: 'Active' },
    { id: 'inactive' as UserFilterType, label: 'Inactive' },
    { id: 'completed' as UserFilterType, label: 'Completed' },
    { id: 'incomplete' as UserFilterType, label: 'Incomplete' },
  ];

  const handleUserSelect = (user: any) => {
    console.log('Selected user:', user);
    // You can implement additional actions when a user is selected
  };

  const handleUsersUpdate = (count: number) => {
    setUsersCount(count);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">User Management</h2>
        <p className="text-gray-600 text-sm mt-1">Manage and view all platform users</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by username, email, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600 whitespace-nowrap">Filter:</span>
            </div>
          </div>

          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  filter === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count and Actions */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium text-black">{usersCount}</span> users
          </p>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Users Table */}
        <UsersTable 
          searchQuery={searchQuery}
          filter={filter}
          onUserSelect={handleUserSelect}
          onUsersUpdate={handleUsersUpdate}
        />
      </div>
    </div>
  );
};

export default UsersPage;
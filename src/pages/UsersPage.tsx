import React, { useState } from 'react';
import { User } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import UsersTable from '../components/users/UsersTable';
import UserDetailModal from '../components/users/UserDetailModal';
import { User as UserType, UserFilterType } from '../types';

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<UserFilterType>('all');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const filterTabs = [
    { id: 'all' as UserFilterType, label: 'All Users', count: 8 },
    { id: 'with-bracelet' as UserFilterType, label: 'With Bracelet', count: 4 },
    { id: 'without-bracelet' as UserFilterType, label: 'Without Bracelet', count: 4 },
    { id: 'issues' as UserFilterType, label: 'Issues', count: 2 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">All Users</h2>
        <p className="text-gray-600 text-sm mt-1">Manage and view all platform users</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <SearchBar
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

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
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-medium text-black">8</span> users
        </div>

        {/* Users Table */}
        <UsersTable 
          searchQuery={searchQuery}
          filter={filter}
          onUserSelect={setSelectedUser}
        />
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default UsersPage;
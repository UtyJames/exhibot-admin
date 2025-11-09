import React from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { User } from '../../types';
import { mockUsers } from '../../data/mockData';

interface UsersTableProps {
  users?: User[];
  searchQuery?: string;
  filter?: string;
  onUserSelect: (user: User) => void;
  limit?: number;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users = mockUsers, 
  searchQuery = '', 
  filter = 'all', 
  onUserSelect,
  limit 
}) => {
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'with-bracelet' && user.hasBracelet) ||
      (filter === 'without-bracelet' && !user.hasBracelet) ||
      (filter === 'issues' && user.status === 'issue');

    return matchesSearch && matchesFilter;
  });

  const displayedUsers = limit ? filteredUsers.slice(0, limit) : filteredUsers;

  const getStatusBadge = (user: User): JSX.Element => {
    if (user.status === 'issue') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3" /> Issue
        </span>
      );
    }
    return user.hasBracelet ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
        <CheckCircle className="w-3 h-3" /> Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
        No Bracelet
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">User ID</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Name</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Email</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Join Date</th>
            {!limit && (
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map(user => (
            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-2 text-sm font-medium text-black">{user.id}</td>
              <td className="py-3 px-2 text-sm text-gray-900">{user.name}</td>
              <td className="py-3 px-2 text-sm text-gray-700">{user.email}</td>
              <td className="py-3 px-2">{getStatusBadge(user)}</td>
              <td className="py-3 px-2 text-sm text-gray-700">{user.joinDate}</td>
              {!limit && (
                <td className="py-3 px-2">
                  <button
                    onClick={() => onUserSelect(user)}
                    className="flex items-center gap-1 text-sm text-black hover:underline font-medium"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No users found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
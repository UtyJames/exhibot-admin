// src/components/users/UsersTable.tsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, MoreVertical, UserX, UserCheck, Trash2, AlertCircle, RefreshCw, Edit3, User } from 'lucide-react';
import { UsersTableProps } from '../../types';
import { usersAPI, User as ApiUser } from '../../service/usersApi';
import UserDetailModal from './UserDetailModal';

// Convert API user to table user format
const convertApiUserToTableUser = (apiUser: ApiUser) => ({
  id: apiUser._id,
  name: apiUser.name || apiUser.userName,
  email: apiUser.email,
  hasBracelet: apiUser.isActive, // Assuming isActive means they have a bracelet
  joinDate: new Date(apiUser.created_at).toLocaleDateString(),
  lastActive: new Date(apiUser.created_at).toLocaleDateString(), // You might want actual last active data
  status: apiUser.isActive ? 'active' : 'inactive',
  phone: '', // Not available in API
  referralCode: '', // Not available in API
  totalReferrals: 0, // Not available in API
  totalTaps: 0, // Not available in API
  // Additional fields from API
  isCompleted: apiUser.isCompleted,
  profilePic: apiUser.profilePic,
  userName: apiUser.userName,
  bio: apiUser.bio,
  address: apiUser.address,
  tags: apiUser.tags,
  followers: apiUser.followers,
  following: apiUser.following,
  socialLinks: apiUser.socialLinks,
});

const UsersTable: React.FC<UsersTableProps> = ({ 
  searchQuery = '', 
  filter = 'all', 
  onUserSelect,
  limit,
  onUsersUpdate 
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        limit: limit || 50,
      };

      // Apply search
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Apply filters
      if (filter === 'active') {
        params.isActive = true;
      } else if (filter === 'inactive') {
        params.isActive = false;
      } else if (filter === 'completed') {
        params.isCompleted = true;
      } else if (filter === 'incomplete') {
        params.isCompleted = false;
      }

      const response = await usersAPI.getUsers(params);
      
      if (response.success) {
        const tableUsers = response.data.users.map(convertApiUserToTableUser);
        setUsers(tableUsers);
        
        // Notify parent component about the update
        if (onUsersUpdate) {
          onUsersUpdate(tableUsers.length);
        }
      }
    } catch (error: any) {
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [searchQuery, filter, limit]);

  const handleRetry = () => {
    fetchUsers();
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await usersAPI.toggleUserStatus(userId);
      fetchUsers(); // Refresh the list
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await usersAPI.deleteUser(userId);
        fetchUsers(); // Refresh the list
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleViewDetails = async (user: any) => {
    try {
      // Fetch full user details
      const response = await usersAPI.getUser(user.id);
      if (response.success) {
        const fullUser = convertApiUserToTableUser(response.data.user);
        setSelectedUser(fullUser);
        setIsDetailModalOpen(true);
        onUserSelect(fullUser);
      }
    } catch (error: any) {
      alert(`Error fetching user details: ${error.message}`);
    }
  };

  const getStatusBadge = (user: any): JSX.Element => {
    if (!user.isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <XCircle className="w-3 h-3" /> Incomplete
        </span>
      );
    }
    
    return user.hasBracelet ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3" /> Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3" /> Inactive
      </span>
    );
  };

  const getCompletionBadge = (user: any): JSX.Element => {
    return user.isCompleted ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Complete
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Incomplete
      </span>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex gap-4">
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Users</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">
          {error}
        </p>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <UserX className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No users found matching your criteria.</p>
      </div>
    );
  }

  const displayedUsers = limit ? users.slice(0, limit) : users;

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-800 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Error loading users: {error}</span>
          </div>
        </div>
      )}
      
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">User</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Email</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Profile</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Join Date</th>
            {!limit && (
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map(user => (
            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 group">
              <td className="py-3 px-2">
                <div className="flex items-center gap-3">
                  {user.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-black">{user.name}</p>
                    <p className="text-xs text-gray-600">@{user.userName}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-2 text-sm text-gray-700">{user.email}</td>
              <td className="py-3 px-2">
                <div className="flex flex-col gap-1">
                  {getStatusBadge(user)}
                  {getCompletionBadge(user)}
                </div>
              </td>
              <td className="py-3 px-2 text-sm text-gray-700">
                <div className="text-xs space-y-1">
                  <div>Followers: {user.followers?.length || 0}</div>
                  <div>Following: {user.following?.length || 0}</div>
                  {user.tags && user.tags.length > 0 && (
                    <div>Tags: {user.tags.slice(0, 2).join(', ')}</div>
                  )}
                </div>
              </td>
              <td className="py-3 px-2 text-sm text-gray-700">{user.joinDate}</td>
              {!limit && (
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium p-2 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-black"
                      title={user.hasBracelet ? 'Deactivate User' : 'Activate User'}
                    >
                      {user.hasBracelet ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 hover:bg-red-100 rounded text-gray-600 hover:text-red-600"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* User Detail Modal */}
      {isDetailModalOpen && selectedUser && (
        <UserDetailModal 
          user={selectedUser}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
};

export default UsersTable;
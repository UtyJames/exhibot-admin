// src/components/users/UserDetailModal.tsx
import React, { useState } from 'react';
import { X, Mail, User, Calendar, MapPin, Edit3, Save, XCircle, CheckCircle, Users, Link2 } from 'lucide-react';
import { usersAPI } from '../../service/usersApi';

interface UserDetailModalProps {
  user: any;
  onClose: () => void;
  onUpdate: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await usersAPI.updateUser(user.id, {
        name: editedUser.name,
        email: editedUser.email,
        bio: editedUser.bio,
        isActive: editedUser.hasBracelet,
      });
      setIsEditing(false);
      onUpdate(); // Refresh the user list
    } catch (error: any) {
      alert(`Error updating user: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);
      await usersAPI.toggleUserStatus(user.id);
      onUpdate(); // Refresh the user list
      onClose(); // Close modal
    } catch (error: any) {
      alert(`Error toggling user status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {user.profilePic ? (
              <img 
                src={user.profilePic} 
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-black">{user.name}</h2>
              <p className="text-sm text-gray-600">@{user.userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title="Edit User"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              user.hasBracelet ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {user.hasBracelet ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {user.hasBracelet ? 'Active' : 'Inactive'}
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              user.isCompleted ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user.isCompleted ? 'Profile Complete' : 'Profile Incomplete'}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <Users className="w-3 h-3" />
              {user.followers?.length || 0} followers
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Following {user.following?.length || 0}
            </span>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-black mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  ) : (
                    <p className="text-sm text-black">{user.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <p className="text-sm text-black">{user.email}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Join Date</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-black">{formatDate(user.joinDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-black mb-3">Profile Details</h3>
              <div className="space-y-3">
                {user.address && (
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Address</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-black">{user.address}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={editedUser.bio || ''}
                      onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-sm h-20"
                      placeholder="User bio..."
                    />
                  ) : (
                    <p className="text-sm text-black">{user.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {user.tags && user.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-black mb-3">Tags & Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.tags.map((tag: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-black mb-3">Social Links</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(user.socialLinks).map(([platform, url]: [string, any]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:border-black transition-colors"
                  >
                    <Link2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium capitalize">{platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleToggleStatus}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium ${
                user.hasBracelet 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } disabled:opacity-50`}
            >
              {user.hasBracelet ? 'Deactivate User' : 'Activate User'}
            </button>
          </div>
          
          <div className="flex gap-2">
            {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              onClick={isEditing ? handleSave : onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : isEditing ? (
                <Save className="w-4 h-4" />
              ) : null}
              {isEditing ? 'Save Changes' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
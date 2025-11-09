import React from 'react';
import { X, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { User } from '../../types';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-black">{user.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{user.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {user.status === 'issue' && user.issue && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Issue Detected</p>
                <p className="text-sm text-red-700 mt-1">{user.issue}</p>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-black mb-3">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="text-sm text-black">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Phone</p>
                <p className="text-sm text-black">{user.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Join Date</p>
                <p className="text-sm text-black">{user.joinDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Last Active</p>
                <p className="text-sm text-black">{user.lastActive}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Referral Code</p>
                <p className="text-sm text-black font-mono">{user.referralCode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Referrals</p>
                <p className="text-sm text-black">{user.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Bracelet Status</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                {user.hasBracelet ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-black">Bracelet Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700">No Bracelet</span>
                  </>
                )}
              </div>
              <div className="text-sm">
                <p className="text-xs text-gray-600 mb-1">Total Taps</p>
                <p className="text-black font-bold text-lg">{user.totalTaps}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
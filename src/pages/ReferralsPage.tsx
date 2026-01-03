import React, { useState, useEffect } from 'react';
import { Trophy, X, FileText, Trash2, Wand2, Eye } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import { Referrer, ReferralApplication, ReviewApplicationPayload } from '../types';
import { referralsAPI } from '../service/referralsApi';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ReferralDetailsModal from '../components/common/ReferralDetailsModal';

const ReferralsPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'applications'>('leaderboard');

  // Leaderboard State
  const [leaderboardData, setLeaderboardData] = useState<Referrer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReferrer, setSelectedReferrer] = useState<Referrer | null>(null);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false);

  // Applications State
  const [applications, setApplications] = useState<ReferralApplication[]>([]);
  const [appSearchQuery, setAppSearchQuery] = useState<string>('');
  const [appStatusFilter, setAppStatusFilter] = useState<string>('');
  const [isLoadingApps, setIsLoadingApps] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] = useState<ReferralApplication | null>(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewData, setReviewData] = useState<ReviewApplicationPayload>({
    status: 'approved',
    adminNotes: '',
    approvedCode: '',
    discountPercentage: 10
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Details Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  // Confirmation Modal State
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDestructive: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    isDestructive: false,
    onConfirm: () => { },
  });

  // Fetch applications
  const fetchApplications = async () => {
    setIsLoadingApps(true);
    try {
      const response = await referralsAPI.getAllApplications(appStatusFilter);
      if (response.success) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    setIsLoadingLeaderboard(true);
    try {
      // Fetch users - requesting a higher limit to sort client-side
      const response = await adminUsersAPI.getUsers({ limit: 100 });
      if (response.success && response.data) {
        // Map users to Referrer format
        const users = response.data.map((user: any) => ({
          userId: user._id,
          name: user.name || user.userName || 'Unknown User',
          code: user.referralCode || 'N/A',
          referrals: user.totalReferrals || 0,
          earnings: `₦${((user.totalReferrals || 0) * 10000).toLocaleString()}`, // Calculating based on assumption
          rank: 0, // Will set after sort
        }));

        // Sort by referrals desc
        const sortedUsers = users
          .sort((a: any, b: any) => b.referrals - a.referrals)
          .map((user: any, index: number) => ({ ...user, rank: index + 1 }));

        setLeaderboardData(sortedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    } else {
      fetchLeaderboard();
    }
  }, [activeTab, appStatusFilter]);

  // Filtered Leaderboard
  const filteredReferrers = leaderboardData.filter(referrer =>
    searchQuery === '' ||
    referrer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referrer.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = appSearchQuery === '' ||
      app.fullName.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
      app.platform.toLowerCase().includes(appSearchQuery.toLowerCase());
    return matchesSearch;
  });

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-gray-400';
      case 3: return 'bg-orange-600';
      default: return 'bg-black';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleOpenReviewModal = (app: ReferralApplication) => {
    setSelectedApplication(app);
    setReviewData({
      status: 'approved',
      adminNotes: '',
      approvedCode: `${app.fullName.split(' ')[0].toUpperCase()}${Math.floor(Math.random() * 1000)}`, // Suggest a code
      discountPercentage: 10
    });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedApplication) return;

    setIsSubmittingReview(true);
    try {
      const payload = { ...reviewData };
      if (reviewData.status === 'rejected') {
        delete payload.approvedCode;
        delete payload.discountPercentage;
      }

      const response = await referralsAPI.reviewApplication(selectedApplication._id, payload);
      if (response.success) { // Assuming success is returned
        setIsReviewModalOpen(false);
        success('Application reviewed successfully');
        fetchApplications(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      toastError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle Generate Referral Code
  const handleGenerateCode = (user: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setConfirmationModal({
      isOpen: true,
      title: 'Generate Referral Code',
      message: `Are you sure you want to generate a referral code for ${user.name}?`,
      confirmText: 'Generate',
      isDestructive: false,
      onConfirm: async () => {
        try {
          // Simple code generation strategy: FIRSTNAME + RANDOM 4 DIGITS
          const baseName = user.name.split(' ')[0].replace(/[^a-zA-Z]/g, '').toUpperCase();
          const randomContent = Math.floor(1000 + Math.random() * 9000);
          const newCode = `${baseName}${randomContent}`;

          const response = await adminUsersAPI.updateUser(user.userId, { referralCode: newCode });
          if (response.success) {
            success(`Code generated successfully: ${newCode}`);
            fetchLeaderboard(); // Refresh list
          }
        } catch (error) {
          console.error('Failed to generate code:', error);
          toastError('Failed to generate referral code.');
        }
      },
    });
  };


  // Handle Delete/Revoke Application
  const handleDeleteApplication = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmationModal({
      isOpen: true,
      title: 'Revoke Application',
      message: 'Are you sure you want to revoke this application? This action cannot be undone and will delete the associated referral code if it exists.',
      confirmText: 'Revoke',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const response = await referralsAPI.deleteApplication(appId);
          if (response.success) {
            // Remove from local state immediately to feel responsive
            setApplications(prev => prev.filter(app => app._id !== appId));
            success('Application revoked successfully');
          }
        } catch (error) {
          console.error('Failed to revoke application:', error);
          toastError('Failed to revoke application');
        }
      },
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Referral Program</h2>
        <p className="text-gray-600 text-sm mt-1">Manage referrals and review applications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'leaderboard'
            ? 'border-black text-black'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'applications'
            ? 'border-black text-black'
            : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Applications
        </button>
      </div>

      {activeTab === 'leaderboard' ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Search */}
          <div className="mb-6">
            <SearchBar
              placeholder="Search by name or referral code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-black">{filteredReferrers.length}</span> referrers
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">Leaderboard</span>
            </div>
          </div>

          {/* Referrers List - Leaderboard */}
          {isLoadingLeaderboard ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReferrers.map(referrer => (
                <div
                  key={referrer.rank}
                  onClick={() => setSelectedReferrer(referrer)}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-black hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-bold ${getRankColor(referrer.rank)}`}>
                      {referrer.rank}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-black">{referrer.name}</p>
                      <p className="text-sm text-gray-600">
                        Code: <span className="font-mono">{referrer.code}</span>
                        {referrer.code === 'N/A' && (
                          <button
                            onClick={(e) => handleGenerateCode(referrer, e)}
                            className="ml-2 text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800 inline-flex items-center gap-1"
                            title="Generate Referral Code"
                          >
                            <Wand2 className="w-3 h-3" /> Generate
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-black">{referrer.referrals} Referrals</p>
                    <p className="text-sm text-gray-600">{referrer.earnings}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoadingLeaderboard && filteredReferrers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No referrers found matching your search.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Applications Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                placeholder="Search by name or platform..."
                value={appSearchQuery}
                onChange={(e) => setAppSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={appStatusFilter}
              onChange={(e) => setAppStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Applications List */}
          {isLoadingApps ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="space-y-3">
              {filteredApplications.map(app => (
                <div
                  key={app._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-black hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4 mb-3 sm:mb-0">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-black">{app.fullName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Platform: {app.platform} • Audience: {app.audienceSize.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleOpenReviewModal(app)}
                      className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Review Application
                    </button>
                  )}

                  {app.status !== 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setIsDetailsModalOpen(true);
                      }}
                      className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  )}

                  {/* Delete/Revoke Button available for all statuses */}
                  <button
                    onClick={(e) => handleDeleteApplication(app._id, e)}
                    className="ml-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Revoke Application"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {app.status !== 'pending' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Reviewed by Admin</p>
                      {app.adminNotes && <p className="text-xs text-gray-500 max-w-xs truncate">Note: {app.adminNotes}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No applications found.</p>
            </div>
          )}
        </div>
      )}

      {/* Referrer Detail Modal (Leaderboard) */}
      {selectedReferrer && activeTab === 'leaderboard' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-bold ${getRankColor(selectedReferrer.rank)}`}>
                  {selectedReferrer.rank}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">{selectedReferrer.name}</h2>
                  <p className="text-sm text-gray-600">Rank #{selectedReferrer.rank}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReferrer(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold text-black">{selectedReferrer.referrals}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold text-black">{selectedReferrer.earnings}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Referral Code</p>
                  <p className="text-lg font-bold text-black font-mono">{selectedReferrer.code}</p>
                </div>
              </div>

              {/* User Info from Leaderboard Selection */}
              <div>
                <h3 className="text-sm font-semibold text-black mb-3">Referrer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">User ID</p>
                    <p className="text-sm text-black font-mono">{selectedReferrer.userId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Conversion Rate</p>
                    <p className="text-sm text-black">
                      {Math.floor((selectedReferrer.referrals / (selectedReferrer.referrals + 10)) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Performance Chart Placeholder */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-black mb-3">Performance Highlights</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Referrals</span>
                    <span className="font-semibold text-black">{selectedReferrer.referrals}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg. per month</span>
                    <span className="font-semibold text-black">{Math.floor(selectedReferrer.referrals / 6)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Commission per referral</span>
                    <span className="font-semibold text-black">₦10,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button onClick={() => setSelectedReferrer(null)} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Application Modal */}
      {isReviewModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold">Review Application</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Applicant Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p><span className="font-semibold">Name:</span> {selectedApplication.fullName}</p>
                <p><span className="font-semibold">Platform:</span> {selectedApplication.platform}</p>
                <p><span className="font-semibold">Handle:</span> {selectedApplication.socialMediaHandle}</p>
                <p><span className="font-semibold">Audience:</span> {selectedApplication.audienceSize}</p>
                <p><span className="font-semibold">Reason:</span> {selectedApplication.reason}</p>
              </div>

              {/* Review Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Decision</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="approved"
                        checked={reviewData.status === 'approved'}
                        onChange={(e) => setReviewData({ ...reviewData, status: e.target.value as 'approved' | 'rejected' })}
                        className="text-black focus:ring-black"
                      />
                      <span className="text-sm">Approve</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="rejected"
                        checked={reviewData.status === 'rejected'}
                        onChange={(e) => setReviewData({ ...reviewData, status: e.target.value as 'approved' | 'rejected' })}
                        className="text-black focus:ring-black"
                      />
                      <span className="text-sm">Reject</span>
                    </label>
                  </div>
                </div>

                {reviewData.status === 'approved' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
                      <input
                        type="text"
                        value={reviewData.approvedCode}
                        onChange={(e) => setReviewData({ ...reviewData, approvedCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="e.g. JOHN2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                      <input
                        type="number"
                        value={reviewData.discountPercentage}
                        onChange={(e) => setReviewData({ ...reviewData, discountPercentage: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                  <textarea
                    value={reviewData.adminNotes}
                    onChange={(e) => setReviewData({ ...reviewData, adminNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[80px]"
                    placeholder="Optional notes..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        isDestructive={confirmationModal.isDestructive}
      />

      {/* Details Modal */}
      <ReferralDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
      />
    </div>
  );
};

export default ReferralsPage;

import React, { useState } from 'react';
import { Search, Trophy, X } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import { Referrer } from '../types';
import { mockReferrers } from '../data/mockData';

const ReferralsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReferrer, setSelectedReferrer] = useState<Referrer | null>(null);

  const filteredReferrers = mockReferrers.filter(referrer =>
    searchQuery === '' ||
    referrer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    referrer.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-gray-400';
      case 3: return 'bg-orange-600';
      default: return 'bg-black';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">All Referrals</h2>
        <p className="text-gray-600 text-sm mt-1">View top referrers and their performance</p>
      </div>

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

        {/* Referrers List */}
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
                  <p className="text-sm text-gray-600">Code: <span className="font-mono">{referrer.code}</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-black">{referrer.referrals} Referrals</p>
                <p className="text-sm text-gray-600">{referrer.earnings}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredReferrers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No referrers found matching your search.</p>
          </div>
        )}
      </div>

      {/* Referrer Detail Modal */}
      {selectedReferrer && (
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

              {/* User Info */}
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

              {/* Performance Chart */}
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
    </div>
  );
};

export default ReferralsPage;
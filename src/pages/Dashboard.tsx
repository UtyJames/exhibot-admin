import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Activity, ShoppingBag, Radio, Trophy } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import UsersTable from '../components/users/UsersTable';
import SkeletonLoader from '../components/layout/SkeletonLoader';
import UserGrowthChart from '../components/analytics/UserGrowthChart';
import TapAnalytics from '../components/analytics/TapAnalytics';
import RevenueChart from '../components/analytics/RevenueChart'; // Fixed import path
import { mockOrders, mockReferrers } from '../data/mockData';

interface DashboardProps {
  setCurrentPage: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const [usersLoading, setUsersLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setUsersLoading(false), 1500);
  }, []);

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value="2,847" change="+12.5%" trend="up" />
        <StatCard title="Active Users" value="1,923" change="+8.3%" trend="up" />
        <StatCard title="Total Orders" value="1,456" change="+15.2%" trend="up" />
        <StatCard title="Bracelet Taps" value="18,234" change="+23.1%" trend="up" />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <UserGrowthChart />
        <RevenueChart />
      </div>

      {/* Tap Analytics */}
      <div className="mb-8">
        <TapAnalytics />
      </div>

      {/* Users Table Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">Recent Users</h3>
          <button 
            onClick={() => setCurrentPage('users')}
            className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {usersLoading ? (
          <SkeletonLoader />
        ) : (
          <UsersTable limit={5} onUserSelect={() => undefined} />
        )}
      </div>

      {/* Orders and Referrals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Orders Preview */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black">Recent Orders</h3>
            <button 
              onClick={() => setCurrentPage('orders')}
              className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Order ID</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm font-medium text-black">{order.id}</td>
                    <td className="py-3 px-2 text-sm text-gray-700">{order.user}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-black text-white' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm font-medium text-black text-right">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referrals Preview */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <h3 className="text-lg font-semibold text-black">Top Referrers</h3>
            </div>
            <button 
              onClick={() => setCurrentPage('referrals')}
              className="text-sm font-medium text-black hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockReferrers.slice(0, 5).map(referrer => (
              <div key={referrer.rank} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">
                    {referrer.rank}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">{referrer.name}</p>
                    <p className="text-xs text-gray-500">{referrer.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-black">{referrer.referrals}</p>
                  <p className="text-xs text-gray-600">{referrer.earnings}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <Users className="w-8 h-8 text-black" />
          <div>
            <p className="text-xs text-gray-600">New Today</p>
            <p className="text-lg font-bold text-black">47</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <Activity className="w-8 h-8 text-black" />
          <div>
            <p className="text-xs text-gray-600">Avg. Engagement</p>
            <p className="text-lg font-bold text-black">6.4</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-black" />
          <div>
            <p className="text-xs text-gray-600">Pending Orders</p>
            <p className="text-lg font-bold text-black">23</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <Radio className="w-8 h-8 text-black" />
          <div>
            <p className="text-xs text-gray-600">Taps Today</p>
            <p className="text-lg font-bold text-black">312</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
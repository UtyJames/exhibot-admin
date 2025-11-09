import React from 'react';
import { BarChart3, Users, TrendingUp, DollarSign } from 'lucide-react';
import UserGrowthChart from '../components/analytics/UserGrowthChart';
import TapAnalytics from '../components/analytics/TapAnalytics';
import RevenueChart from '../components/analytics/RevenueChart';
import StatCard from '../components/common/StatCard';

const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Analytics Dashboard</h2>
        <p className="text-gray-600 text-sm mt-1">Detailed analytics and insights for your platform</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Monthly Active Users" 
          value="1,847" 
          change="+8.3%" 
          trend="up" 
        />
        <StatCard 
          title="Total Revenue" 
          value="₦2.4M" 
          change="+15.2%" 
          trend="up" 
        />
        <StatCard 
          title="Avg. Session Duration" 
          value="6.4m" 
          change="+2.1%" 
          trend="up" 
        />
        <StatCard 
          title="Conversion Rate" 
          value="12.8%" 
          change="+1.5%" 
          trend="up" 
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <UserGrowthChart />
        <RevenueChart />
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <TapAnalytics />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-black" />
            <div>
              <h3 className="text-lg font-semibold text-black">User Engagement</h3>
              <p className="text-sm text-gray-600">Daily active patterns</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Peak Hours</span>
              <span className="text-sm font-semibold text-black">6-9 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. Daily Taps</span>
              <span className="text-sm font-semibold text-black">312</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Retention Rate</span>
              <span className="text-sm font-semibold text-black">78%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-black" />
            <div>
              <h3 className="text-lg font-semibold text-black">Growth Metrics</h3>
              <p className="text-sm text-gray-600">Platform expansion</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">New Users (30d)</span>
              <span className="text-sm font-semibold text-black">347</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Referral Signups</span>
              <span className="text-sm font-semibold text-black">128</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">MoM Growth</span>
              <span className="text-sm font-semibold text-black">12.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-black" />
            <div>
              <h3 className="text-lg font-semibold text-black">Revenue Insights</h3>
              <p className="text-sm text-gray-600">Financial performance</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg. Order Value</span>
              <span className="text-sm font-semibold text-black">₦49,999</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Lifetime Value</span>
              <span className="text-sm font-semibold text-black">₦124,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Repeat Rate</span>
              <span className="text-sm font-semibold text-black">42%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
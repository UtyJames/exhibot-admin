// src/pages/AnalyticsPage.tsx
import React, { useState } from 'react';
import { BarChart3, Users, TrendingUp, DollarSign, Eye, MousePointer, UserPlus, Radio, Calendar, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import UserGrowthChart from '../components/analytics/UserGrowthChart';
import TapAnalytics from '../components/analytics/TapAnalytics';
import RevenueChart from '../components/analytics/RevenueChart';
import StatCard from '../components/common/StatCard';
import { useAnalytics } from '../hooks/useAnalytics';

const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<string>('all'); // all, week, month, custom
  const { analytics, isLoading, error, refetch, fetchWithDateRange } = useAnalytics();

  // Format user growth data for the chart
  const formatUserGrowthData = () => {
    if (!analytics?.userGrowth) return [];
    
    return analytics.userGrowth.map(item => ({
      name: `${item._id.month}/${item._id.year}`,
      value: item.count,
    }));
  };

  // Format posts by platform data for the chart
  const formatPostsByPlatformData = () => {
    if (!analytics?.postsByPlatform) return [];
    
    return analytics.postsByPlatform.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }));
  };

  // Format events by type data for the chart
  const formatEventsByTypeData = () => {
    if (!analytics?.eventsByType) return [];
    
    return analytics.eventsByType.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }));
  };

  // Calculate growth percentages (you might want to get these from the API)
  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    
    const now = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;

    switch (range) {
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      case 'custom':
        // You can implement custom date picker here
        break;
      default:
        // 'all' - no date filters
        startDate = undefined;
        endDate = undefined;
    }

    if (startDate && endDate) {
      fetchWithDateRange(startDate, endDate);
    } else {
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-80 animate-pulse"></div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-80 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Analytics</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const stats = analytics?.analytics;

  return (
    <div>
      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Analytics Dashboard</h2>
          <p className="text-gray-600 text-sm mt-1">Real-time platform performance metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-orange-800">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">Partial Data Loaded</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Profile Views" 
          value={stats?.totalProfileViews?.toLocaleString() || "0"} 
          change="+12.5%" 
          trend="up" 
          icon={<Eye className="w-5 h-5" />}
        />
        <StatCard 
          title="Link Clicks" 
          value={stats?.totalLinkClicks?.toLocaleString() || "0"} 
          change="+8.3%" 
          trend="up" 
          icon={<MousePointer className="w-5 h-5" />}
        />
        <StatCard 
          title="New Followers" 
          value={stats?.totalNewFollowers?.toLocaleString() || "0"} 
          change="+15.2%" 
          trend="up" 
          icon={<UserPlus className="w-5 h-5" />}
        />
        <StatCard 
          title="Bracelet Taps" 
          value={stats?.totalBraceletTaps?.toLocaleString() || "0"} 
          change="+23.1%" 
          trend="up" 
          icon={<Radio className="w-5 h-5" />}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                User Growth
              </h3>
              <p className="text-sm text-gray-600 mt-1">Monthly user acquisition trends</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-black">
                {analytics?.userGrowth?.reduce((sum, item) => sum + item.count, 0) || 0}
              </p>
              <p className="text-sm text-green-600 font-medium">
                Total Users
              </p>
            </div>
          </div>
          <UserGrowthChart data={formatUserGrowthData()} />
        </div>

        {/* Platform Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                Posts by Platform
              </h3>
              <p className="text-sm text-gray-600 mt-1">Content distribution across platforms</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-black">
                {analytics?.postsByPlatform?.reduce((sum, item) => sum + item.count, 0) || 0}
              </p>
              <p className="text-sm text-gray-600">Total Posts</p>
            </div>
          </div>
          <TapAnalytics data={formatPostsByPlatformData()} />
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Events Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Events by Type
              </h3>
              <p className="text-sm text-gray-600 mt-1">Event type distribution</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-black">
                {analytics?.eventsByType?.reduce((sum, item) => sum + item.count, 0) || 0}
              </p>
              <p className="text-sm text-gray-600">Total Events</p>
            </div>
          </div>
          <div className="space-y-3">
            {analytics?.eventsByType?.map((eventType, index) => (
              <div key={eventType._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                      ][index % 5]
                    }}
                  />
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {eventType._id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-black">{eventType.count}</span>
                  <span className="text-xs text-gray-600 ml-2">
                    ({Math.round((eventType.count / (analytics.eventsByType.reduce((sum, item) => sum + item.count, 0) || 1)) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-black" />
            <div>
              <h3 className="text-lg font-semibold text-black">Engagement Metrics</h3>
              <p className="text-sm text-gray-600">User interaction patterns</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Views per Profile</span>
              <span className="text-sm font-semibold text-black">
                {stats ? Math.round(stats.totalProfileViews / 39) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Engagement Rate</span>
              <span className="text-sm font-semibold text-black">
                {stats && stats.totalProfileViews > 0 
                  ? `${((stats.totalLinkClicks / stats.totalProfileViews) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Follower Growth Rate</span>
              <span className="text-sm font-semibold text-black">
                {stats ? Math.round(stats.totalNewFollowers / 39) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tap Conversion</span>
              <span className="text-sm font-semibold text-black">
                {stats && stats.totalBraceletTaps > 0 
                  ? `${((stats.totalLinkClicks / stats.totalBraceletTaps) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8 text-black" />
            <div>
              <h3 className="text-lg font-semibold text-black">Platform Performance</h3>
              <p className="text-sm text-gray-600">Content platform insights</p>
            </div>
          </div>
          <div className="space-y-4">
            {analytics?.postsByPlatform?.slice(0, 5).map((platform, index) => (
              <div key={platform._id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-black capitalize">
                    {platform._id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-black">{platform.count}</span>
                  <span className="text-xs text-gray-600 ml-2">
                    ({Math.round((platform.count / (analytics.postsByPlatform.reduce((sum, item) => sum + item.count, 0) || 1)) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          {analytics?.postsByPlatform && analytics.postsByPlatform.length > 5 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                +{analytics.postsByPlatform.length - 5} more platforms
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-black mb-1">
              {stats?.totalProfileViews || 0}
            </div>
            <div className="text-xs text-gray-600">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black mb-1">
              {stats?.totalLinkClicks || 0}
            </div>
            <div className="text-xs text-gray-600">Link Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black mb-1">
              {stats?.totalNewFollowers || 0}
            </div>
            <div className="text-xs text-gray-600">New Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black mb-1">
              {stats?.totalBraceletTaps || 0}
            </div>
            <div className="text-xs text-gray-600">Bracelet Taps</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
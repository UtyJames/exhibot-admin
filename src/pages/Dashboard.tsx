import React, {useState, useEffect} from 'react';
import { ChevronRight, Users, Activity, ShoppingBag, Radio, Trophy, RefreshCw, AlertCircle, UserCheck, UserX, FileText, Calendar, DollarSign, LogOut } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import UsersTable from '../components/users/UsersTable';
import SkeletonLoader from '../components/layout/SkeletonLoader';
import UserGrowthChart from '../components/analytics/UserGrowthChart';
import TapAnalytics from '../components/analytics/TapAnalytics';
import RevenueChart from '../components/analytics/RevenueChart';
import { useDashboard } from '../hooks/useDashboard';
import { useAnalytics } from '../hooks/useAnalytics';
import { useActivities } from '../hooks/useActivities';
import { useAuth } from '../context/AuthContext';
import { RecentUser } from '../types/dashboard';
import { cartsAPI } from '../service/cartsApi';

interface DashboardProps {
  setCurrentPage: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const [cartsCount, setCartsCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const { dashboardData, isLoading, error, refetch } = useDashboard();
  const { analytics: analyticsData } = useAnalytics();
  const { activities, isLoading: activitiesLoading } = useActivities({ limit: 5 });
  const { logout, user } = useAuth();

  useEffect(() => {
    const fetchCartsCountAndRevenue = async () => {
      try {
        const response = await cartsAPI.getCarts({ limit: 1000 });
        const carts = response.data.carts;
        setCartsCount(carts.length);
        
        // Calculate total revenue: each bracelet costs ₦25,000
        const revenue = carts.length * 25000;
        setTotalRevenue(revenue);
      } catch (error) {
        console.error('Failed to fetch carts count:', error);
      }
    };

    fetchCartsCountAndRevenue();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  // Format user growth data from analytics
  const formatUserGrowthData = () => {
    if (!analyticsData?.userGrowth) return [];
    
    return analyticsData.userGrowth.map(item => ({
      name: `${item._id.month}/${item._id.year}`,
      value: item.count,
    }));
  };

  // Format posts by platform data
  const formatPostsByPlatformData = () => {
    if (!analyticsData?.postsByPlatform) return [];
    
    return analyticsData.postsByPlatform.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }));
  };

  // Format revenue data from carts
  const formatRevenueData = () => {
    const monthlyRevenue = Math.floor(totalRevenue / 12);
    return [
      { name: 'Jan', value: monthlyRevenue * 0.8 },
      { name: 'Feb', value: monthlyRevenue * 0.9 },
      { name: 'Mar', value: monthlyRevenue * 1.1 },
      { name: 'Apr', value: monthlyRevenue * 0.7 },
      { name: 'May', value: monthlyRevenue * 1.2 },
      { name: 'Jun', value: monthlyRevenue * 1.0 },
      { name: 'Jul', value: monthlyRevenue * 1.3 },
      { name: 'Aug', value: monthlyRevenue * 1.1 },
      { name: 'Sep', value: monthlyRevenue * 0.9 },
      { name: 'Oct', value: monthlyRevenue * 1.4 },
      { name: 'Nov', value: monthlyRevenue * 1.2 },
      { name: 'Dec', value: monthlyRevenue * 1.5 },
    ];
  };

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return '👁️';
      case 'follow':
        return '👤';
      case 'bought_bracelet':
        return '💰';
      case 'bracelet_tap':
        return '📱';
      default:
        return '📝';
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
        <SkeletonLoader />
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h3>
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

  const stats = dashboardData?.stats;
  const recentUsers = dashboardData?.recentUsers || [];

  return (
    <div>
      {/* Header with Refresh and Logout */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Dashboard Overview</h2>
          <p className="text-gray-600 text-sm mt-1">
            Real-time platform statistics • Welcome, {user?.name || user?.userName}
            {error && (
              <span className="text-orange-600 ml-2">• Partial data loaded</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers?.toLocaleString() || "0"} 
          change="+12.5%" 
          trend="up" 
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard 
          title="Active Users" 
          value={stats?.activeUsers?.toLocaleString() || "0"} 
          change="+8.3%" 
          trend="up" 
          icon={<UserCheck className="w-5 h-5" />}
        />
        <StatCard 
          title="Bracelet Orders" 
          value={cartsCount.toLocaleString()} 
          change="+15.2%" 
          trend="up" 
          onClick={() => setCurrentPage('orders')}
          icon={<ShoppingBag className="w-5 h-5" />}
        />
        <StatCard 
          title="Total Revenue" 
          value={`₦${totalRevenue.toLocaleString()}`} 
          change="+23.1%" 
          trend="up" 
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <UserGrowthChart data={formatUserGrowthData()} />
        <RevenueChart revenueData={formatRevenueData()} totalRevenue={totalRevenue} />
      </div>

      {/* Tap Analytics */}
      <div className="mb-8">
        <TapAnalytics data={formatPostsByPlatformData()} title="Posts by Platform" />
      </div>

      {/* Recent Users & Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Users */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">Recent Users</h3>
            <button 
              onClick={() => setCurrentPage('users')}
              className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentUsers.slice(0, 5).map(user => (
              <div key={user._id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                {user.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt={user.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">
                    {user.name || user.userName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No recent users</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities from API */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">Recent Activities</h3>
            <div className="text-sm text-gray-600">
              {activities.length} activities
            </div>
          </div>
          
          <div className="space-y-4">
            {activitiesLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-start gap-3 p-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.slice(0, 5).map(activity => (
              <div key={activity._id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex-shrink-0">
                  {activity.actor.profilePic ? (
                    <img 
                      src={activity.actor.profilePic} 
                      alt={activity.actor.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.created_at).toLocaleDateString()} • {new Date(activity.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                  activity.isRead ? 'bg-gray-300' : 'bg-blue-500'
                }`} />
              </div>
            ))}
            {!activitiesLoading && activities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">All Users</h3>
          <button 
            onClick={() => setCurrentPage('users')}
            className="flex items-center gap-2 text-sm font-medium text-black hover:underline"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <UsersTable limit={5} onUserSelect={() => {}} />
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <Users className="w-8 h-8 text-black" />
          <div>
            <p className="text-xs text-gray-600">New Today</p>
            <p className="text-lg font-bold text-black">
              {recentUsers.filter(user => 
                new Date(user.created_at).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <Activity className="w-8 h-8 text-black" />
          <div>
            <p className="text-xs text-gray-600">Activities Today</p>
            <p className="text-lg font-bold text-black">
              {activities.filter(activity => 
                new Date(activity.created_at).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <UserCheck className="w-8 h-8 text-black" />
          <div>
            <p className="text-xs text-gray-600">Completed Profiles</p>
            <p className="text-lg font-bold text-black">
              {recentUsers.filter(user => user.isCompleted).length}
            </p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-black" />
          <div>
            <p className="text-xs text-gray-600">Bracelet Revenue</p>
            <p className="text-lg font-bold text-black">₦{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
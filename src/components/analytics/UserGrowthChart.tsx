import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, UserPlus } from 'lucide-react';
import { ChartData } from '../../types';
import { userGrowthData } from '../../data/mockData';

const UserGrowthChart: React.FC = () => {
  const formatNumber = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const currentValue = payload[0].value;
      const previousValue = userGrowthData.find(item => item.name === label)?.value || 0;
      const growth = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Total Users: <span className="font-semibold text-black">{currentValue.toLocaleString()}</span>
            </p>
            {growth !== 0 && (
              <p className={`text-xs font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growth >= 0 ? '↑' : '↓'} {Math.abs(growth).toFixed(1)}% from previous
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate growth metrics
  const calculateMetrics = () => {
    const totalUsers = userGrowthData[userGrowthData.length - 1]?.value || 0;
    const newUsersThisMonth = userGrowthData[userGrowthData.length - 1]?.value - (userGrowthData[userGrowthData.length - 2]?.value || 0);
    const totalGrowth = ((userGrowthData[userGrowthData.length - 1]?.value - userGrowthData[0]?.value) / userGrowthData[0]?.value) * 100;
    const averageMonthlyGrowth = totalGrowth / (userGrowthData.length - 1);

    return { totalUsers, newUsersThisMonth, totalGrowth, averageMonthlyGrowth };
  };

  const { totalUsers, newUsersThisMonth, totalGrowth, averageMonthlyGrowth } = calculateMetrics();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-black flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            User Growth
          </h3>
          <p className="text-sm text-gray-600 mt-1">Monthly user acquisition trends</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-black">{totalUsers.toLocaleString()}</p>
          <p className="text-sm font-medium flex items-center gap-1 justify-end text-green-600">
            <TrendingUp className="w-4 h-4 text-green-600" />
            +{totalGrowth.toFixed(1)}% total growth
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            vertical={false}
          />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatNumber}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6" 
            fill="url(#userGrowthGradient)" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#3B82F6', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Growth Metrics */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-gray-600">New This Month</p>
          </div>
          <p className="text-lg font-bold text-black">+{newUsersThisMonth}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Avg. Monthly Growth</p>
          <p className="text-lg font-bold text-black">+{averageMonthlyGrowth.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Peak Growth</p>
          <p className="text-lg font-bold text-black">
            +{Math.max(...userGrowthData.map((item, index) => {
              if (index === 0) return 0;
              const prev = userGrowthData[index - 1].value;
              return ((item.value - prev) / prev) * 100;
            })).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {/* <div className="mt-4">
        <h4 className="text-sm font-semibold text-black mb-3">Monthly Performance</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userGrowthData.slice(-6).map((month, index, array) => {
            const growth = index > 0 ? 
              ((month.value - array[index - 1].value) / array[index - 1].value) * 100 : 0;
            
            return (
              <div key={month.name} className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">{month.name}</p>
                <p className="text-sm font-semibold text-black">{month.value}</p>
                {index > 0 && (
                  <p className={`text-xs font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
};

export default UserGrowthChart;
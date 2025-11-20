import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp } from 'lucide-react';
import { ChartData } from '../../types';

interface UserGrowthChartProps {
  data: ChartData[];
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data = [] }) => {
  const formatNumber = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              New Users: <span className="font-semibold text-black">{payload[0].value.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate metrics from data
  const calculateMetrics = () => {
    if (data.length === 0) {
      return { totalUsers: 0, totalGrowth: 0, averageMonthlyGrowth: 0 };
    }

    const totalUsers = data.reduce((sum, item) => sum + item.value, 0);
    const totalGrowth = data.length > 1 
      ? ((data[data.length - 1].value - data[0].value) / data[0].value) * 100 
      : 0;
    const averageMonthlyGrowth = totalGrowth / (data.length - 1);

    return { totalUsers, totalGrowth, averageMonthlyGrowth };
  };

  const { totalUsers, totalGrowth, averageMonthlyGrowth } = calculateMetrics();

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
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
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
          <p className="text-xs text-gray-600 mb-1">Current Month</p>
          <p className="text-sm font-semibold text-black">
            {data.length > 0 ? data[data.length - 1].value.toLocaleString() : 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Average Monthly</p>
          <p className="text-sm font-semibold text-black">
            {totalUsers > 0 ? Math.round(totalUsers / data.length).toLocaleString() : 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Peak Growth</p>
          <p className="text-sm font-semibold text-black">
            {Math.max(...data.map(item => item.value)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthChart;
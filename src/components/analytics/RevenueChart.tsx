import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';
import { ChartData } from '../../types';
import { revenueData } from '../../data/mockData';

const RevenueChart: React.FC = () => {
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}K`;
    }
    return `₦${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Revenue: <span className="font-semibold text-black">₦{payload[0].value.toLocaleString()}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {payload[0].value >= 1000000 
              ? `₦${(payload[0].value / 1000000).toFixed(2)} million`
              : `₦${(payload[0].value / 1000).toFixed(0)} thousand`
            }
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate growth percentage
  const calculateGrowth = (): number => {
    if (revenueData.length < 2) return 0;
    const firstValue = revenueData[0].value;
    const lastValue = revenueData[revenueData.length - 1].value;
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const growth = calculateGrowth();
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-black flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Revenue Growth
          </h3>
          <p className="text-sm text-gray-600 mt-1">Monthly revenue performance</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-black">
            ₦{(totalRevenue / revenueData.length).toLocaleString()}
          </p>
          <p className={`text-sm font-medium flex items-center gap-1 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`w-4 h-4 ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% vs previous period
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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
            tickFormatter={formatCurrency}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#10B981" 
            fill="url(#revenueGradient)" 
            strokeWidth={3}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Current Month</p>
          <p className="text-sm font-semibold text-black">
            {formatCurrency(revenueData[revenueData.length - 1]?.value || 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Average Monthly</p>
          <p className="text-sm font-semibold text-black">
            {formatCurrency(totalRevenue / revenueData.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Peak Revenue</p>
          <p className="text-sm font-semibold text-black">
            {formatCurrency(Math.max(...revenueData.map(item => item.value)))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
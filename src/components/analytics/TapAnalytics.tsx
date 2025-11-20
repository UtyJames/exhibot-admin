// src/components/analytics/TapAnalytics.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../../types/analytics';

interface TapAnalyticsProps {
  data?: ChartData[];
  title?: string;
}

const TapAnalytics: React.FC<TapAnalyticsProps> = ({ 
  data = [], 
  title = "Platform Distribution" 
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Count: <span className="font-semibold text-black">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
          />
          <Tooltip 
            content={<CustomTooltip />}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }} 
          />
          <Bar 
            dataKey="value" 
            fill="#000000" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TapAnalytics;
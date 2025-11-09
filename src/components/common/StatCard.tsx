import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatCardProps } from '../../types';

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend }) => {
  const getTrendColor = (): string => {
    if (!trend) return 'text-gray-600';
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <p className="text-sm text-gray-600 mb-2">{title}</p>
      <div className="flex items-baseline gap-3">
        <h3 className="text-3xl font-bold text-black">{value}</h3>
        {change && (
          <span className={`text-sm font-medium flex items-center gap-1 ${getTrendColor()}`}>
            {trend && <TrendIcon className="w-4 h-4" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
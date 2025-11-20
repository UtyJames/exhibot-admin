// src/components/common/StatCard.tsx - Updated version
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatCardProps } from '../../types';


const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon,
  onClick
  
}) => {
  const getTrendColor = (): string => {
    if (!trend) return 'text-gray-600';
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
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
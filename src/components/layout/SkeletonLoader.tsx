import React from 'react';

const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse space-y-3">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="flex gap-4">
        <div className="h-12 bg-gray-200 rounded flex-1"></div>
        <div className="h-12 bg-gray-200 rounded flex-1"></div>
        <div className="h-12 bg-gray-200 rounded flex-1"></div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
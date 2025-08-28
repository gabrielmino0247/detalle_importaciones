import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  variation?: number;
  icon: React.ReactNode;
  format?: 'number' | 'percentage';
}

export const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  variation, 
  icon, 
  format = 'number' 
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return format === 'percentage' ? `${val.toFixed(1)}%` : val.toLocaleString();
    }
    return val;
  };

  const getVariationIcon = () => {
    if (variation === undefined) return null;
    if (variation > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (variation < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getVariationColor = () => {
    if (variation === undefined) return '';
    if (variation > 0) return 'text-green-500';
    if (variation < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        {variation !== undefined && (
          <div className={`flex items-center space-x-1 ${getVariationColor()}`}>
            {getVariationIcon()}
            <span className="text-sm font-medium">
              {Math.abs(variation).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {formatValue(value)}
        </h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RankingItem } from '../types';

interface RankingChartProps {
  data: RankingItem[];
  title: string;
  dataKey?: string;
  color?: string;
}

export const RankingChart: React.FC<RankingChartProps> = ({ 
  data, 
  title, 
  dataKey = 'value',
  color = '#3B82F6'
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString(), 'Unidades']}
            />
            <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
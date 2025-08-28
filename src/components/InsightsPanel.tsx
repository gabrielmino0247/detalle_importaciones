import React from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface InsightsPanelProps {
  insights: string[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Insights Automáticos</h3>
        <TrendingUp className="w-4 h-4 text-blue-500" />
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
      
      {insights.length === 0 && (
        <p className="text-gray-500 italic">No hay insights disponibles para los filtros seleccionados.</p>
      )}
    </div>
  );
};
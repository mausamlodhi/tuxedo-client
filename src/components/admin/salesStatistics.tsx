
'use client';

import React from 'react';

interface ChartBarProps {
  month: string;
  rentValue: number;
  buyValue: number;
  maxValue: number;
}

const ChartBar: React.FC<ChartBarProps> = ({ month, rentValue, buyValue, maxValue }) => {
  const rentHeight = (rentValue / maxValue) * 100;
  const buyHeight = (buyValue / maxValue) * 100;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-end space-x-1 h-95">
        {/* Rent Bar */}
        <div className="w-2 rounded-t flex flex-col justify-end" style={{ height: '192px' }}>
          <div
            className="bg-blue-400 rounded-t transition-all duration-500"
            style={{ height: `${rentHeight}%`, minHeight: rentValue > 0 ? '4px' : '0' }}
          />
        </div>
        {/* Buy Bar */}
        <div className="w-2 rounded-t flex flex-col justify-end" style={{ height: '192px' }}>
          <div
            className="bg-green-400 rounded-t transition-all duration-500"
            style={{ height: `${buyHeight}%`, minHeight: buyValue > 0 ? '4px' : '0' }}
          />
        </div>
      </div>
      <span className="text-gray-400 text-sm font-medium">{month}</span>
    </div>
  );
};

const SalesStatistics = ({theme}:{theme:boolean | object}) => {
  const salesData = [
    { month: 'Jan', rent: 30, buy: 15 },
    { month: 'Feb', rent: 50, buy: 80 },
    { month: 'Mar', rent: 45, buy: 50 },
    { month: 'Apr', rent: 25, buy: 15 },
    { month: 'May', rent: 55, buy: 90 },
    { month: 'June', rent: 40, buy: 55 }
  ];
  const maxValue = Math.max(...salesData.flatMap(item => [item.rent, item.buy]));
  const yAxisLabels = ['$0', '$5k', '$30k', '$50k', '$80k', '$120k'];

  return (
    <div className={`${theme?"bg-[#FFFFFF]":"bg-[#313A46]"} rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${theme?"text-[#2D333C]":"text-[#FFFFFF]"}`}>Sales Statistic June - 2025</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-400 text-sm">Rent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-400 text-sm">Buy</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Chart Container */}
        <div className="flex items-end justify-between">
          {/* Y-axis */}
          <div className="flex flex-col justify-between h-92 mr-4">
            {yAxisLabels.reverse().map((label, index) => (
              <span key={index} className={`${theme?"text-[#C1C1C1]":"text-[#FFFFFF]"} text-xs`}>
                {label}
              </span>
            ))}
          </div>

          {/* Chart Bars */}
          <div className="flex-1 flex justify-between items-end px-4">
            {salesData.map((data, index) => (
              <ChartBar
                key={index}
                month={data.month}
                rentValue={data.rent}
                buyValue={data.buy}
                maxValue={maxValue}
              />
            ))}
          </div>
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="absolute left-0 right-0 border-t border-gray-700 border-dotted"
              style={{ top: `${(index * 100) / 5}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesStatistics;
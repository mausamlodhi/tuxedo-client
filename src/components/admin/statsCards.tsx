'use client';

import React, { useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CustomerData {
  total: string | number;
  change: string | number;
  changeType: 'increase' | 'decrease';
  data: any
}


interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  changeLabel: string;
  progress: number;
  progressColor: string;
  theme:boolean | object;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  changeLabel,
  progress,
  progressColor,
  theme
}) => {
  return (
    <div className={`${theme?"bg-[#FFFFFF] text-[#313A46]":"bg-[#313A46] text-[#C1C1C1]"} rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-md font-medium ${theme?"":"text-gray-400"} mb-1`}>{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        
        {/* Circular Progress */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke={progressColor}
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${progress} 100`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
            changeType === 'increase'
              ? 'bg-[#47AD77] text-[#FFFFFF]'
              : 'bg-[#F15776] text-[#FFFFFF]'
          }`}
        >
          {changeType === 'increase' ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {change}
        </span>
        <span className={`text-sm ${theme?"":"text-gray-400"}`}>{changeLabel}</span>
      </div>
    </div>
  );
};

interface StatsCardsProps {
  theme: boolean | object;
  customerData: CustomerData | null;
}




const StatsCards: React.FC<StatsCardsProps> = ({ theme, customerData }) => {




  const stats = [
    {
      title: 'Customers',
      value: customerData ? String(customerData?.data?.totalCustomers) : '0',
      change: customerData ? String(customerData?.data?.growth) : '0',
      changeType: 'increase' as const,
      changeLabel: 'Since last month',
      progress: 75,
      progressColor: '#10B981'
    },
    {
      title: 'Orders',
      value: '7,543',
      change: '1.08%',
      changeType: 'decrease' as const,
      changeLabel: 'Since last month',
      progress: 60,
      progressColor: '#3B82F6'
    },
    {
      title: 'Revenue',
      value: '$9,254',
      change: '7.00%',
      changeType: 'increase' as const,
      changeLabel: 'Since last month',
      progress: 85,
      progressColor: '#06B6D4'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} theme={theme} />
      ))}
    </div>
  );
};

export default StatsCards;
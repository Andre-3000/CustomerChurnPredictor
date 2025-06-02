import React from 'react';
import { Customer } from '../types/customer';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CustomerSegmentationProps {
  customers: Customer[];
}

export const CustomerSegmentation: React.FC<CustomerSegmentationProps> = ({ customers }) => {
  // Calculate segment distribution
  const getSegmentData = () => {
    const segments: Record<string, { count: number; churned: number }> = {};
    
    customers.forEach(customer => {
      if (!segments[customer.segment]) {
        segments[customer.segment] = { count: 0, churned: 0 };
      }
      
      segments[customer.segment].count++;
      if (customer.churn) {
        segments[customer.segment].churned++;
      }
    });
    
    return Object.entries(segments).map(([segment, data]) => ({
      name: segment,
      value: data.count,
      churnRate: (data.churned / data.count) * 100
    }));
  };
  
  const segmentData = getSegmentData();
  
  const COLORS = ['#2563EB', '#8B5CF6', '#EC4899', '#14B8A6'];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Customer Segmentation</h2>
      </div>
      
      <div className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === 'value') {
                    return [value, 'Customers'];
                  }
                  return [value, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Churn Rate by Segment</h3>
          <div className="space-y-2">
            {segmentData.map((segment, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="flex-1 text-sm">{segment.name}</div>
                <div className="text-sm font-medium">
                  {segment.churnRate.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
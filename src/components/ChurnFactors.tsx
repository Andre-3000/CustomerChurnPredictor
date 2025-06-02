import React from 'react';
import { Customer } from '../types/customer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChurnFactorsProps {
  customers: Customer[];
}

export const ChurnFactors: React.FC<ChurnFactorsProps> = ({ customers }) => {
  // Calculate factor importance by comparing churned vs. non-churned customers
  const getFactorData = () => {
    const churned = customers.filter(c => c.churn);
    const active = customers.filter(c => !c.churn);
    
    if (churned.length === 0 || active.length === 0) return [];
    
    const avgChurned = {
      supportTickets: churned.reduce((sum, c) => sum + c.supportTickets, 0) / churned.length,
      loginFrequency: churned.reduce((sum, c) => sum + c.loginFrequency, 0) / churned.length,
      daysInactive: churned.reduce((sum, c) => sum + c.daysInactive, 0) / churned.length,
      monthlySpend: churned.reduce((sum, c) => sum + c.monthlySpend, 0) / churned.length
    };
    
    const avgActive = {
      supportTickets: active.reduce((sum, c) => sum + c.supportTickets, 0) / active.length,
      loginFrequency: active.reduce((sum, c) => sum + c.loginFrequency, 0) / active.length,
      daysInactive: active.reduce((sum, c) => sum + c.daysInactive, 0) / active.length,
      monthlySpend: active.reduce((sum, c) => sum + c.monthlySpend, 0) / active.length
    };
    
    return [
      {
        name: 'Support Tickets',
        churned: avgChurned.supportTickets,
        active: avgActive.supportTickets,
        difference: (avgChurned.supportTickets / avgActive.supportTickets - 1) * 100
      },
      {
        name: 'Login Frequency',
        churned: avgChurned.loginFrequency,
        active: avgActive.loginFrequency,
        difference: (avgActive.loginFrequency / avgChurned.loginFrequency - 1) * 100
      },
      {
        name: 'Days Inactive',
        churned: avgChurned.daysInactive,
        active: avgActive.daysInactive,
        difference: (avgChurned.daysInactive / avgActive.daysInactive - 1) * 100
      },
      {
        name: 'Monthly Spend',
        churned: avgChurned.monthlySpend,
        active: avgActive.monthlySpend,
        difference: (avgActive.monthlySpend / avgChurned.monthlySpend - 1) * 100
      }
    ];
  };
  
  const factorData = getFactorData();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Key Churn Factors</h2>
      </div>
      
      <div className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={factorData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'difference') {
                    return [`${Math.abs(value).toFixed(0)}% ${value >= 0 ? 'higher' : 'lower'}`, 'Difference'];
                  }
                  return [value.toFixed(2), name];
                }}
              />
              <Bar dataKey="difference" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>Chart shows the percentage difference in metrics between churned and active customers.</p>
        </div>
      </div>
    </div>
  );
};
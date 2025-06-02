import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Customer } from '../types/customer';

interface ChurnMetricsProps {
  customers: Customer[];
}

export const ChurnMetrics: React.FC<ChurnMetricsProps> = ({ customers }) => {
  // Calculate churn rate
  const churnCount = customers.filter(c => c.churn).length;
  const churnRate = (churnCount / customers.length) * 100;
  
  // Calculate predicted churn
  const predictedChurnCount = customers.filter(c => c.predictedChurn).length;
  const predictedChurnRate = (predictedChurnCount / customers.length) * 100;
  
  // Prepare data for risk distribution chart
  const riskDistribution = [
    { name: 'Low Risk', value: customers.filter(c => c.churnProbability && c.churnProbability < 0.3).length },
    { name: 'Medium Risk', value: customers.filter(c => c.churnProbability && c.churnProbability >= 0.3 && c.churnProbability < 0.7).length },
    { name: 'High Risk', value: customers.filter(c => c.churnProbability && c.churnProbability >= 0.7).length }
  ];
  
  // Prepare data for monthly spend vs churn risk
  const spendData = Array.from({ length: 10 }, (_, i) => {
    const min = i * 100;
    const max = (i + 1) * 100;
    const customersInRange = customers.filter(c => c.monthlySpend >= min && c.monthlySpend < max);
    const churnCountInRange = customersInRange.filter(c => c.churn).length;
    const churnRateInRange = customersInRange.length > 0 ? (churnCountInRange / customersInRange.length) * 100 : 0;
    
    return {
      range: `$${min}-${max}`,
      customers: customersInRange.length,
      churnRate: churnRateInRange
    };
  }).filter(d => d.customers > 0);
  
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Churn Metrics</h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Customers</p>
            <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Actual Churn</p>
            <p className="text-2xl font-bold text-red-600">{churnRate.toFixed(1)}%</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Predicted Churn</p>
            <p className="text-2xl font-bold text-purple-600">{predictedChurnRate.toFixed(1)}%</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">High Risk Customers</p>
            <p className="text-2xl font-bold text-amber-600">{riskDistribution[2].value}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Customer Risk Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-64">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Monthly Spend vs. Churn Rate</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={spendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="churnRate" name="Churn Rate (%)" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
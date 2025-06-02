import React from 'react';
import { BarChart, Users, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { customers, refreshData } = useApp();
  
  // Calculate high-risk customers
  const highRiskCount = customers.filter(c => c.churnProbability && c.churnProbability >= 0.7).length;
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Customer Churn Predictor</h1>
              <p className="text-sm text-gray-500">AI-powered churn analytics dashboard</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{customers.length} Customers</span>
            </div>
            
            <div className="flex items-center bg-red-50 text-red-700 px-3 py-1.5 rounded-md">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{highRiskCount} High Risk</span>
            </div>
            
            <button 
              onClick={refreshData}
              className="ml-0 sm:ml-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
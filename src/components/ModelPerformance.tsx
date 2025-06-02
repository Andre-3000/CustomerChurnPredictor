import React from 'react';
import { useApp } from '../context/AppContext';

export const ModelPerformance: React.FC = () => {
  const { modelMetrics } = useApp();
  
  const getMetricColor = (value: number) => {
    if (value >= 0.8) return 'text-green-600';
    if (value >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Model Performance</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Accuracy</span>
              <span className={`text-sm font-semibold ${getMetricColor(modelMetrics.accuracy)}`}>
                {formatPercent(modelMetrics.accuracy)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${modelMetrics.accuracy * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Overall prediction accuracy
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Precision</span>
              <span className={`text-sm font-semibold ${getMetricColor(modelMetrics.precision)}`}>
                {formatPercent(modelMetrics.precision)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${modelMetrics.precision * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Accuracy of positive predictions
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Recall</span>
              <span className={`text-sm font-semibold ${getMetricColor(modelMetrics.recall)}`}>
                {formatPercent(modelMetrics.recall)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${modelMetrics.recall * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ability to find all positive cases
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">F1 Score</span>
              <span className={`text-sm font-semibold ${getMetricColor(modelMetrics.f1Score)}`}>
                {formatPercent(modelMetrics.f1Score)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${modelMetrics.f1Score * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Balance between precision and recall
            </p>
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 p-3 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-1">About This Model</h3>
          <p className="text-xs text-blue-700">
            This demonstration uses a simplified logistic regression model to predict customer churn based on key behavior metrics like engagement, spend, and support history.
          </p>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Customer } from '../types/customer';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar, DollarSign, Clock, BarChart } from 'lucide-react';
import classNames from 'classnames';

interface CustomerProfileProps {
  customer: Customer;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer }) => {
  const { setSelectedCustomer } = useApp();
  
  const getRiskColor = (probability?: number) => {
    if (!probability) return 'bg-gray-100 text-gray-800';
    if (probability >= 0.7) return 'bg-red-100 text-red-800';
    if (probability >= 0.3) return 'bg-amber-100 text-amber-800';
    return 'bg-green-100 text-green-800';
  };

  const getRiskLabel = (probability?: number) => {
    if (!probability) return 'Unknown';
    if (probability >= 0.7) return 'High Risk';
    if (probability >= 0.3) return 'Medium Risk';
    return 'Low Risk';
  };
  
  // Calculate key churn factors
  const churnFactors = [];
  
  if (customer.daysInactive > 30) {
    churnFactors.push({
      factor: 'Inactive Account',
      description: `${customer.daysInactive} days since last login`,
      severity: 'high'
    });
  }
  
  if (customer.supportTickets > 5) {
    churnFactors.push({
      factor: 'Support Issues',
      description: `${customer.supportTickets} support tickets opened`,
      severity: 'high'
    });
  }
  
  if (customer.loginFrequency < 10) {
    churnFactors.push({
      factor: 'Low Engagement',
      description: `${customer.loginFrequency} logins per month`,
      severity: 'medium'
    });
  }
  
  if (customer.monthlySpend < 200) {
    churnFactors.push({
      factor: 'Low Spend',
      description: `$${customer.monthlySpend.toFixed(2)} monthly spend`,
      severity: 'medium'
    });
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Customer Profile</h2>
        <button
          onClick={() => setSelectedCustomer(null)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to List
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-500">
              {customer.name.charAt(0)}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-medium text-gray-900">{customer.name}</h3>
            <p className="text-gray-500">{customer.email}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap -mx-2 mb-6">
          <div className="px-2 w-full md:w-1/3 mb-3 md:mb-0">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center text-gray-500 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-xs">Customer Since</span>
              </div>
              <div className="text-gray-900 font-medium">
                {new Date(customer.joinDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="px-2 w-full md:w-1/3 mb-3 md:mb-0">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center text-gray-500 mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-xs">Total Spend</span>
              </div>
              <div className="text-gray-900 font-medium">
                ${customer.totalSpend.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="px-2 w-full md:w-1/3 mb-3 md:mb-0">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center text-gray-500 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-xs">Last Purchase</span>
              </div>
              <div className="text-gray-900 font-medium">
                {new Date(customer.lastPurchaseDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <BarChart className="h-5 w-5 mr-2 text-gray-500" />
            <h4 className="text-md font-medium text-gray-900">Churn Prediction</h4>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div 
                className={classNames(
                  "px-3 py-1 text-sm font-medium rounded-full", 
                  getRiskColor(customer.churnProbability)
                )}
              >
                {getRiskLabel(customer.churnProbability)}
              </div>
              <div className="text-lg font-bold">
                {customer.churnProbability !== undefined ? 
                  `${(customer.churnProbability * 100).toFixed(0)}%` : 
                  'N/A'
                }
              </div>
            </div>
            
            <div className="w-full bg-gray-300 rounded-full h-2.5">
              <div 
                className={classNames(
                  "h-2.5 rounded-full",
                  customer.churnProbability && customer.churnProbability >= 0.7 ? "bg-red-500" :
                  customer.churnProbability && customer.churnProbability >= 0.3 ? "bg-amber-500" : "bg-green-500"
                )}
                style={{ width: `${customer.churnProbability ? customer.churnProbability * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-2">Key Churn Factors</h4>
          
          {churnFactors.length === 0 ? (
            <p className="text-gray-500 text-sm">No significant churn factors detected.</p>
          ) : (
            <div className="space-y-2">
              {churnFactors.map((factor, index) => (
                <div 
                  key={index} 
                  className={classNames(
                    "border-l-4 px-3 py-2 rounded-r-md",
                    factor.severity === 'high' ? "border-red-500 bg-red-50" :
                    factor.severity === 'medium' ? "border-amber-500 bg-amber-50" : "border-blue-500 bg-blue-50"
                  )}
                >
                  <div className="font-medium text-gray-900">{factor.factor}</div>
                  <div className="text-sm text-gray-600">{factor.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Customer Details</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Segment</p>
              <p className="font-medium">{customer.segment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Region</p>
              <p className="font-medium">{customer.region}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Subscription</p>
              <p className="font-medium">{customer.subscriptionTier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Login Frequency</p>
              <p className="font-medium">{customer.loginFrequency} per month</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Session Time</p>
              <p className="font-medium">{customer.avgSessionTime} min</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Purchase Frequency</p>
              <p className="font-medium">{customer.purchaseFrequency} per month</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500">Product Categories</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {customer.productCategories.map((category, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
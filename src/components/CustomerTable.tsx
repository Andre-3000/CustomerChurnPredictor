import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types/customer';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import classNames from 'classnames';

interface CustomerTableProps {
  customers: Customer[];
}

export const CustomerTable: React.FC<CustomerTableProps> = ({ customers }) => {
  const { setSelectedCustomer } = useApp();
  const [sortField, setSortField] = useState<keyof Customer>('churnProbability');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'joinDate' || sortField === 'lastPurchaseDate') {
      aValue = new Date(aValue as Date).getTime();
      bValue = new Date(bValue as Date).getTime();
    }
    
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getRiskColor = (probability?: number) => {
    if (!probability) return 'bg-gray-100 text-gray-800';
    if (probability >= 0.7) return 'bg-red-100 text-red-800';
    if (probability >= 0.3) return 'bg-amber-100 text-amber-800';
    return 'bg-green-100 text-green-800';
  };

  const getRiskLabel = (probability?: number) => {
    if (!probability) return 'Unknown';
    if (probability >= 0.7) return 'High';
    if (probability >= 0.3) return 'Medium';
    return 'Low';
  };

  return (
    <div className="overflow-x-auto mt-4">
      {customers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No customers match your search criteria.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Customer
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('segment')}
              >
                <div className="flex items-center">
                  Segment
                  {sortField === 'segment' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('monthlySpend')}
              >
                <div className="flex items-center">
                  Monthly Spend
                  {sortField === 'monthlySpend' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('churnProbability')}
              >
                <div className="flex items-center">
                  Churn Risk
                  {sortField === 'churnProbability' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCustomers.map((customer) => (
              <tr 
                key={customer.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => setSelectedCustomer(customer)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.segment}</div>
                  <div className="text-sm text-gray-500">{customer.region}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${customer.monthlySpend.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(customer.lastPurchaseDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className={classNames(
                        "px-2 py-1 text-xs font-medium rounded-full", 
                        getRiskColor(customer.churnProbability)
                      )}
                    >
                      {getRiskLabel(customer.churnProbability)}
                    </div>
                    <div className="ml-2 text-sm text-gray-500">
                      {customer.churnProbability !== undefined ? 
                        `${(customer.churnProbability * 100).toFixed(0)}%` : 
                        'N/A'
                      }
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {customer.churn ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Churned
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
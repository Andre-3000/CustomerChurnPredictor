import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerTable } from './CustomerTable';
import { CustomerProfile } from './CustomerProfile';
import { ChurnMetrics } from './ChurnMetrics';
import { ChurnFactors } from './ChurnFactors';
import { SearchFilter } from './SearchFilter';
import { ModelPerformance } from './ModelPerformance';
import { CustomerSegmentation } from './CustomerSegmentation';

export const Dashboard: React.FC = () => {
  const { filteredCustomers, selectedCustomer } = useApp();
  const [searchFilter, setSearchFilter] = useState({ term: '', churnRisk: '' });
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChurnMetrics customers={filteredCustomers} />
        </div>
        <div>
          <ModelPerformance />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer Analysis</h2>
            </div>
            <div className="p-4">
              <SearchFilter 
                onFilterChange={(filter) => setSearchFilter(filter)}
              />
              <CustomerTable 
                customers={filteredCustomers}
              />
            </div>
          </div>
        </div>
        
        <div>
          {selectedCustomer ? (
            <CustomerProfile customer={selectedCustomer} />
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <ChurnFactors customers={filteredCustomers} />
              <CustomerSegmentation customers={filteredCustomers} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
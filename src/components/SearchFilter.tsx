import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter } from 'lucide-react';

interface SearchFilterProps {
  onFilterChange: (filter: { term: string; churnRisk: string }) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onFilterChange }) => {
  const { filterCustomers } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [churnRisk, setChurnRisk] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterCustomers({ term: searchTerm, churnRisk });
    onFilterChange({ term: searchTerm, churnRisk });
  };
  
  const handleRiskFilter = (risk: string) => {
    const newRisk = risk === churnRisk ? '' : risk;
    setChurnRisk(newRisk);
    filterCustomers({ term: searchTerm, churnRisk: newRisk });
    onFilterChange({ term: searchTerm, churnRisk: newRisk });
  };
  
  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="flex items-center mb-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search customers by name, email, or segment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>
      
      <div className="flex items-center">
        <Filter className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-700 mr-3">Filter by risk:</span>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleRiskFilter('low')}
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              churnRisk === 'low'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            Low Risk
          </button>
          
          <button
            onClick={() => handleRiskFilter('medium')}
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              churnRisk === 'medium'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            }`}
          >
            Medium Risk
          </button>
          
          <button
            onClick={() => handleRiskFilter('high')}
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              churnRisk === 'high'
                ? 'bg-red-500 text-white'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            High Risk
          </button>
        </div>
      </div>
    </div>
  );
};
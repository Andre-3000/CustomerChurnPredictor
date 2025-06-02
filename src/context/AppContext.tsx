import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer } from '../types/customer';
import { generateMockCustomers } from '../data/mockData';
import { trainModel, predictChurn } from '../ml/model';

interface AppContextType {
  customers: Customer[];
  filteredCustomers: Customer[];
  selectedCustomer: Customer | null;
  modelMetrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  setSelectedCustomer: (customer: Customer | null) => void;
  filterCustomers: (filter: { term?: string; churnRisk?: string }) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // Generate mock data
    const mockCustomers = generateMockCustomers(100);
    
    // Train model and get predictions
    const { trainedModel, metrics } = trainModel(mockCustomers);
    
    // Apply predictions to customers
    const customersWithPredictions = mockCustomers.map(customer => {
      const { probability, prediction } = predictChurn(trainedModel, customer);
      return {
        ...customer,
        churnProbability: probability,
        predictedChurn: prediction
      };
    });
    
    setCustomers(customersWithPredictions);
    setFilteredCustomers(customersWithPredictions);
    setModelMetrics(metrics);
  };

  const filterCustomers = (filter: { term?: string; churnRisk?: string }) => {
    let filtered = [...customers];
    
    if (filter.term) {
      const term = filter.term.toLowerCase();
      filtered = filtered.filter(
        customer => 
          customer.name.toLowerCase().includes(term) || 
          customer.email.toLowerCase().includes(term) ||
          customer.segment.toLowerCase().includes(term)
      );
    }
    
    if (filter.churnRisk) {
      if (filter.churnRisk === 'high') {
        filtered = filtered.filter(customer => customer.churnProbability >= 0.7);
      } else if (filter.churnRisk === 'medium') {
        filtered = filtered.filter(customer => customer.churnProbability >= 0.3 && customer.churnProbability < 0.7);
      } else if (filter.churnRisk === 'low') {
        filtered = filtered.filter(customer => customer.churnProbability < 0.3);
      }
    }
    
    setFilteredCustomers(filtered);
  };

  return (
    <AppContext.Provider
      value={{
        customers,
        filteredCustomers,
        selectedCustomer,
        modelMetrics,
        setSelectedCustomer,
        filterCustomers,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
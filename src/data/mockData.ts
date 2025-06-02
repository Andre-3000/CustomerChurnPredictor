import { Customer } from '../types/customer';

// Helper function to get random value from array
const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Helper function to get random number within range
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get random date within range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generateMockCustomers = (count: number): Customer[] => {
  const customers: Customer[] = [];
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(now.getFullYear() - 2);
  
  const segments = ['Enterprise', 'SMB', 'Startup', 'Individual'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
  const subscriptionTiers = ['Free', 'Basic', 'Premium', 'Enterprise'];
  const productCategories = [
    'Analytics', 'CRM', 'Marketing', 'Finance', 
    'Sales', 'Support', 'HR', 'Communication', 'Productivity'
  ];
  
  for (let i = 0; i < count; i++) {
    const joinDate = getRandomDate(twoYearsAgo, oneYearAgo);
    const lastPurchaseDate = getRandomDate(joinDate, now);
    
    // Calculate tenure in months
    const tenureMonths = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    // Randomly select 1-3 product categories
    const customerCategories: string[] = [];
    const categoryCount = getRandomNumber(1, 3);
    while (customerCategories.length < categoryCount) {
      const category = getRandomItem(productCategories);
      if (!customerCategories.includes(category)) {
        customerCategories.push(category);
      }
    }
    
    // Determine churn status - more likely to churn if:
    // - High support tickets
    // - Low login frequency
    // - High days inactive
    // - Low monthly spend
    const supportTickets = getRandomNumber(0, 10);
    const loginFrequency = getRandomNumber(0, 30);
    const daysInactive = getRandomNumber(0, 60);
    const monthlySpend = getRandomNumber(0, 1000);
    
    // Calculate churn probability factors
    const churnFactors = [
      supportTickets > 5 ? 0.2 : 0,
      loginFrequency < 10 ? 0.25 : 0,
      daysInactive > 30 ? 0.3 : 0,
      monthlySpend < 200 ? 0.15 : 0
    ];
    
    // Determine actual churn status - this will be our "ground truth" for the model
    const churnProbability = churnFactors.reduce((sum, factor) => sum + factor, 0.1);
    const churn = Math.random() < churnProbability;
    
    customers.push({
      id: `CUS-${10000 + i}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      age: getRandomNumber(22, 65),
      gender: getRandomItem(['Male', 'Female', 'Other']),
      segment: getRandomItem(segments),
      region: getRandomItem(regions),
      joinDate,
      subscriptionTier: getRandomItem(subscriptionTiers),
      monthlySpend,
      totalSpend: monthlySpend * tenureMonths,
      lastPurchaseDate,
      purchaseFrequency: getRandomNumber(0, 10),
      productCategories: customerCategories,
      avgSessionTime: getRandomNumber(1, 60),
      loginFrequency,
      supportTickets,
      daysInactive,
      churn
    });
  }
  
  return customers;
};
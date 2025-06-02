export interface Customer {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  segment: string;
  region: string;
  joinDate: Date;
  subscriptionTier: string;
  monthlySpend: number;
  totalSpend: number;
  lastPurchaseDate: Date;
  purchaseFrequency: number;
  productCategories: string[];
  avgSessionTime: number;
  loginFrequency: number;
  supportTickets: number;
  daysInactive: number;
  churn: boolean;
  churnProbability?: number;
  predictedChurn?: boolean;
}

export interface CustomerFeature {
  age: number;
  monthlySpend: number;
  totalSpend: number;
  purchaseFrequency: number;
  avgSessionTime: number;
  loginFrequency: number;
  supportTickets: number;
  daysInactive: number;
  subscriptionTierValue: number;
  tenure: number;
}

export interface CustomerFilter {
  term?: string;
  churnRisk?: string;
}
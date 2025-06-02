import { Customer, CustomerFeature } from '../types/customer';

// Prepare features for machine learning model
export const prepareFeatures = (customer: Customer): CustomerFeature => {
  // Calculate tenure in days
  const now = new Date();
  const tenureDays = Math.floor((now.getTime() - customer.joinDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Map subscription tier to numeric value
  let subscriptionTierValue = 0;
  switch (customer.subscriptionTier) {
    case 'Free': subscriptionTierValue = 1; break;
    case 'Basic': subscriptionTierValue = 2; break;
    case 'Premium': subscriptionTierValue = 3; break;
    case 'Enterprise': subscriptionTierValue = 4; break;
    default: subscriptionTierValue = 0;
  }
  
  return {
    age: customer.age,
    monthlySpend: customer.monthlySpend,
    totalSpend: customer.totalSpend,
    purchaseFrequency: customer.purchaseFrequency,
    avgSessionTime: customer.avgSessionTime,
    loginFrequency: customer.loginFrequency,
    supportTickets: customer.supportTickets,
    daysInactive: customer.daysInactive,
    subscriptionTierValue,
    tenure: tenureDays
  };
};

// This is a simplified logistic regression model for demo purposes
export interface LogisticRegressionModel {
  weights: Record<string, number>;
  bias: number;
}

// Calculate sigmoid function for logistic regression
const sigmoid = (z: number): number => {
  return 1 / (1 + Math.exp(-z));
};

// Train a simple logistic regression model
export const trainModel = (customers: Customer[]) => {
  // Prepare training data
  const features: CustomerFeature[] = customers.map(prepareFeatures);
  const labels: boolean[] = customers.map(c => c.churn);
  
  // Initialize model with mock weights
  // In a real implementation, we would calculate these through gradient descent
  const model: LogisticRegressionModel = {
    weights: {
      age: -0.01,
      monthlySpend: -0.003,
      totalSpend: -0.0005,
      purchaseFrequency: -0.08,
      avgSessionTime: -0.03,
      loginFrequency: -0.05,
      supportTickets: 0.15,
      daysInactive: 0.05,
      subscriptionTierValue: -0.3,
      tenure: -0.002
    },
    bias: 0.5
  };
  
  // Calculate model predictions for evaluation
  const predictions = features.map(feature => {
    const { probability } = predictWithModel(model, feature);
    return probability > 0.5;
  });
  
  // Calculate evaluation metrics
  const metrics = calculateMetrics(labels, predictions);
  
  return {
    trainedModel: model,
    metrics
  };
};

// Make prediction with trained model
const predictWithModel = (model: LogisticRegressionModel, feature: CustomerFeature) => {
  // Calculate weighted sum
  let z = model.bias;
  
  for (const [key, value] of Object.entries(feature)) {
    z += model.weights[key] * value;
  }
  
  // Apply sigmoid function to get probability
  const probability = sigmoid(z);
  
  return {
    probability,
    prediction: probability > 0.5
  };
};

// Predict churn for a customer
export const predictChurn = (model: LogisticRegressionModel, customer: Customer) => {
  const feature = prepareFeatures(customer);
  return predictWithModel(model, feature);
};

// Calculate evaluation metrics
const calculateMetrics = (actual: boolean[], predicted: boolean[]) => {
  let truePositive = 0;
  let trueNegative = 0;
  let falsePositive = 0;
  let falseNegative = 0;
  
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] && predicted[i]) truePositive++;
    else if (!actual[i] && !predicted[i]) trueNegative++;
    else if (!actual[i] && predicted[i]) falsePositive++;
    else if (actual[i] && !predicted[i]) falseNegative++;
  }
  
  const accuracy = (truePositive + trueNegative) / actual.length;
  const precision = truePositive / (truePositive + falsePositive) || 0;
  const recall = truePositive / (truePositive + falseNegative) || 0;
  const f1Score = 2 * precision * recall / (precision + recall) || 0;
  
  return {
    accuracy,
    precision,
    recall,
    f1Score
  };
};
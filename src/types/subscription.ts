// src/types/subscription.ts


export interface SubscriptionPlan {
  planId: string;
  planName: string;
  price: number;
  durationDays: number;
  features: string[];
  featureNames: string[];
  originalPrice?: number;
  discount?: number;
  isPopular?: boolean;
  isBestValue?: boolean;
  isDisabled?: boolean;
  badgeTextKey?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethodId?: string;
}

export interface SubscriptionData {
  plans: SubscriptionPlan[];
  userSubscription?: UserSubscription;
}

// for testing the UI
export const subscriptionPlansData: SubscriptionData = {
  plans: [
    {
      planId: 'VIP_WEEK',
      planName: 'Week',
      price: 9.99,
      durationDays: 7,
      features: ['basic_trip_planning', 'unlimited_destinations', 'vip_support'],
      featureNames: ['Basic Trip Planning', 'Unlimited Destinations', 'VIP Support']
    },
    {
      planId: 'VIP_MONTH',
      planName: 'Month',
      price: 29.99,
      durationDays: 30,
      features: ['advanced_trip_planning', 'basic_trip_planning', 'blog_publishing', 'unlimited_destinations', 'vip_support'],
      featureNames: ['Advanced Trip Planning', 'Basic Trip Planning', 'Blog Publishing', 'Unlimited Destinations', 'VIP Support'],
      isPopular: true
    },
    {
      planId: 'VIP_QUARTER',
      planName: 'Quarter',
      price: 79.99,
      durationDays: 90,
      features: ['advanced_trip_planning', 'basic_trip_planning', 'blog_publishing', 'premium_trip_planning', 'unlimited_destinations', 'vip_support'],
      featureNames: ['Advanced Trip Planning', 'Basic Trip Planning', 'Blog Publishing', 'Premium Trip Planning', 'Unlimited Destinations', 'VIP Support'],
      isBestValue: true
    },
    {
      planId: 'VIP_YEAR',
      planName: 'Year',
      price: 299.99,
      durationDays: 365,
      features: ['advanced_trip_planning', 'basic_trip_planning', 'blog_publishing', 'premium_trip_planning', 'unlimited_destinations', 'vip_support'],
      featureNames: ['Advanced Trip Planning', 'Basic Trip Planning', 'Blog Publishing', 'Premium Trip Planning', 'Unlimited Destinations', 'VIP Support']
    },
  ]
};

// Mock user subscription for testing
export const mockUserSubscription: UserSubscription = {
  id: 'sub_123',
  userId: 'user_123', // This will be replaced with actual user ID
  planId: 'week',
  status: 'active',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  autoRenew: true,
};
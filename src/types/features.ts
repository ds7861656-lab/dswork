// src/types/features.ts

/**
 * Feature access control system for subscription-based features
 * This system provides a maintainable and extensible way to manage
 * feature availability based on user subscription levels.
 */

// Feature identifiers - these should be unique and descriptive
export const FeatureId = {
  // Trip Planning Features
  BASIC_TRIP_PLANNING: 'basic_trip_planning',
  ADVANCED_TRIP_PLANNING: 'advanced_trip_planning',
  PREMIUM_TRIP_PLANNING: 'premium_trip_planning',
  ULTIMATE_TRIP_PLANNING: 'ultimate_trip_planning',

  // Destination Access
  LIMITED_DESTINATIONS: 'limited_destinations',
  UNLIMITED_DESTINATIONS: 'unlimited_destinations',
  VIP_DESTINATIONS: 'vip_destinations',
  EXCLUSIVE_DESTINATIONS: 'exclusive_destinations',

  // Support Features
  EMAIL_SUPPORT: 'email_support',
  PRIORITY_EMAIL_SUPPORT: 'priority_email_support',
  PHONE_SUPPORT: 'phone_support',
  DEDICATED_CONCIERGE: 'dedicated_concierge',

  // Platform Access
  MOBILE_APP_ACCESS: 'mobile_app_access',

  // Content Features
  BLOG_PUBLISHING: 'blog_publishing',
  PREMIUM_CONTENT: 'premium_content',
  EXCLUSIVE_TOURS: 'exclusive_tours',
} as const;

export type FeatureId = typeof FeatureId[keyof typeof FeatureId];

// Feature definition with metadata
export interface FeatureDefinition {
  id: FeatureId;
  name: string;
  description: string;
  category: 'planning' | 'destinations' | 'support' | 'platform' | 'content';
}

// Feature access result
export interface FeatureAccessResult {
  hasAccess: boolean;
  feature: FeatureDefinition;
  userPlan?: string;
  requiredPlans: string[];
  upgradeMessage?: string;
}

// Centralized feature registry
export const FEATURE_REGISTRY: Record<FeatureId, FeatureDefinition> = {
  [FeatureId.BASIC_TRIP_PLANNING]: {
    id: FeatureId.BASIC_TRIP_PLANNING,
    name: 'Basic Trip Planning',
    description: 'Create and manage basic trip itineraries',
    category: 'planning',
  },
  [FeatureId.ADVANCED_TRIP_PLANNING]: {
    id: FeatureId.ADVANCED_TRIP_PLANNING,
    name: 'Advanced Trip Planning',
    description: 'Advanced trip planning with detailed customization',
    category: 'planning',
  },
  [FeatureId.PREMIUM_TRIP_PLANNING]: {
    id: FeatureId.PREMIUM_TRIP_PLANNING,
    name: 'Premium Trip Planning',
    description: 'Premium trip planning with expert recommendations',
    category: 'planning',
  },
  [FeatureId.ULTIMATE_TRIP_PLANNING]: {
    id: FeatureId.ULTIMATE_TRIP_PLANNING,
    name: 'Ultimate Trip Planning',
    description: 'Ultimate trip planning with concierge service',
    category: 'planning',
  },
  [FeatureId.LIMITED_DESTINATIONS]: {
    id: FeatureId.LIMITED_DESTINATIONS,
    name: 'Limited Destinations',
    description: 'Access to popular destinations',
    category: 'destinations',
  },
  [FeatureId.UNLIMITED_DESTINATIONS]: {
    id: FeatureId.UNLIMITED_DESTINATIONS,
    name: 'Unlimited Destinations',
    description: 'Access to all destinations worldwide',
    category: 'destinations',
  },
  [FeatureId.VIP_DESTINATIONS]: {
    id: FeatureId.VIP_DESTINATIONS,
    name: 'VIP Destinations',
    description: 'Access to VIP and exclusive locations',
    category: 'destinations',
  },
  [FeatureId.EXCLUSIVE_DESTINATIONS]: {
    id: FeatureId.EXCLUSIVE_DESTINATIONS,
    name: 'Exclusive Destinations',
    description: 'Access to ultra-exclusive and private locations',
    category: 'destinations',
  },
  [FeatureId.EMAIL_SUPPORT]: {
    id: FeatureId.EMAIL_SUPPORT,
    name: 'Email Support',
    description: 'Standard email support',
    category: 'support',
  },
  [FeatureId.PRIORITY_EMAIL_SUPPORT]: {
    id: FeatureId.PRIORITY_EMAIL_SUPPORT,
    name: 'Priority Email Support',
    description: 'Priority email support with faster response times',
    category: 'support',
  },
  [FeatureId.PHONE_SUPPORT]: {
    id: FeatureId.PHONE_SUPPORT,
    name: '24/7 Phone Support',
    description: 'Round-the-clock phone support',
    category: 'support',
  },
  [FeatureId.DEDICATED_CONCIERGE]: {
    id: FeatureId.DEDICATED_CONCIERGE,
    name: 'Dedicated Concierge',
    description: 'Personal concierge service',
    category: 'support',
  },
  [FeatureId.MOBILE_APP_ACCESS]: {
    id: FeatureId.MOBILE_APP_ACCESS,
    name: 'Mobile App Access',
    description: 'Access to mobile applications',
    category: 'platform',
  },
  [FeatureId.BLOG_PUBLISHING]: {
    id: FeatureId.BLOG_PUBLISHING,
    name: 'Blog Publishing',
    description: 'Publish and manage blog posts',
    category: 'content',
  },
  [FeatureId.PREMIUM_CONTENT]: {
    id: FeatureId.PREMIUM_CONTENT,
    name: 'Premium Content',
    description: 'Access to premium content and guides',
    category: 'content',
  },
  [FeatureId.EXCLUSIVE_TOURS]: {
    id: FeatureId.EXCLUSIVE_TOURS,
    name: 'Exclusive Tours',
    description: 'Access to exclusive and private tours',
    category: 'content',
  },
};

// Feature to plan mapping - defines which plans have access to which features
export const FEATURE_PLAN_MAPPING: Record<FeatureId, string[]> = {
  [FeatureId.BASIC_TRIP_PLANNING]: ['week', 'month', 'season', 'year'],
  [FeatureId.ADVANCED_TRIP_PLANNING]: ['month', 'season', 'year'],
  [FeatureId.PREMIUM_TRIP_PLANNING]: ['season', 'year'],
  [FeatureId.ULTIMATE_TRIP_PLANNING]: ['year'],

  [FeatureId.LIMITED_DESTINATIONS]: ['week'],
  [FeatureId.UNLIMITED_DESTINATIONS]: ['month', 'season', 'year'],
  [FeatureId.VIP_DESTINATIONS]: ['season', 'year'],
  [FeatureId.EXCLUSIVE_DESTINATIONS]: ['year'],

  [FeatureId.EMAIL_SUPPORT]: ['week', 'month', 'season', 'year'],
  [FeatureId.PRIORITY_EMAIL_SUPPORT]: ['month', 'season', 'year'],
  [FeatureId.PHONE_SUPPORT]: ['season', 'year'],
  [FeatureId.DEDICATED_CONCIERGE]: ['year'],

  [FeatureId.MOBILE_APP_ACCESS]: ['month', 'season', 'year'],

  [FeatureId.BLOG_PUBLISHING]: ['month', 'season', 'year'],
  [FeatureId.PREMIUM_CONTENT]: ['season', 'year'],
  [FeatureId.EXCLUSIVE_TOURS]: ['year'],
};

// Plan hierarchy for upgrade suggestions
export const PLAN_HIERARCHY = ['week', 'month', 'season', 'year'];

// Helper function to get the next better plan
export const getUpgradePlan = (currentPlanId: string, requiredPlans: string[]): string | null => {
  const currentIndex = PLAN_HIERARCHY.indexOf(currentPlanId);
  if (currentIndex === -1) return null;

  // Find the lowest tier plan that provides access
  for (const planId of PLAN_HIERARCHY) {
    if (PLAN_HIERARCHY.indexOf(planId) > currentIndex && requiredPlans.includes(planId)) {
      return planId;
    }
  }

  return null;
};
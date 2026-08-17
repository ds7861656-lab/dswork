// src/config/features.ts

/**
 * SHARED CONFIGURATION - Feature Management
 *
 * This file contains SHARED configuration that must be kept in sync
 * between frontend and backend. It defines feature availability and
 * business rules that both client and server need to understand.
 *
 * 🚨 SYNCHRONIZATION REQUIRED:
 * - Keep this file synchronized between FE and BE repositories
 * - Backend must implement the same feature access logic
 * - Any changes here require backend deployment
 *
 * Backend Implementation:
 * - Use FEATURE_PLAN_MAPPING for access control validation
 * - Implement BackendFeatureService using these configurations
 * - Validate feature access server-side before processing requests
 *
 * Security Note: This configuration is public knowledge (ships with frontend).
 * Never put sensitive business logic or secrets here.
 */

import { FeatureId } from '../types/features';

/**
 * Feature configuration with additional metadata for UI and business logic
 */
export interface FeatureConfig {
  id: FeatureId;
  enabled: boolean; // Global feature toggle
  beta: boolean; // Beta feature flag
  requiresAuth: boolean; // Requires user authentication
  premiumOnly: boolean; // Only available to paying users
  description: string;
  upgradePrompt: string;
}

/**
 * Centralized feature configuration
 * Use this to control feature availability, beta status, and upgrade prompts
 */
export const FEATURE_CONFIG: Record<FeatureId, FeatureConfig> = {
  [FeatureId.BASIC_TRIP_PLANNING]: {
    id: FeatureId.BASIC_TRIP_PLANNING,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: false,
    description: 'Create and manage basic trip itineraries',
    upgradePrompt: 'Upgrade to access advanced trip planning features',
  },
  [FeatureId.ADVANCED_TRIP_PLANNING]: {
    id: FeatureId.ADVANCED_TRIP_PLANNING,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Advanced trip planning with detailed customization',
    upgradePrompt: 'Upgrade to Month plan for advanced trip planning',
  },
  [FeatureId.PREMIUM_TRIP_PLANNING]: {
    id: FeatureId.PREMIUM_TRIP_PLANNING,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Premium trip planning with expert recommendations',
    upgradePrompt: 'Upgrade to Season plan for premium trip planning',
  },
  [FeatureId.ULTIMATE_TRIP_PLANNING]: {
    id: FeatureId.ULTIMATE_TRIP_PLANNING,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Ultimate trip planning with concierge service',
    upgradePrompt: 'Upgrade to Year plan for ultimate trip planning',
  },
  [FeatureId.LIMITED_DESTINATIONS]: {
    id: FeatureId.LIMITED_DESTINATIONS,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: false,
    description: 'Access to popular destinations',
    upgradePrompt: 'Upgrade to access more destinations',
  },
  [FeatureId.UNLIMITED_DESTINATIONS]: {
    id: FeatureId.UNLIMITED_DESTINATIONS,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Access to all destinations worldwide',
    upgradePrompt: 'Upgrade to Month plan for unlimited destinations',
  },
  [FeatureId.VIP_DESTINATIONS]: {
    id: FeatureId.VIP_DESTINATIONS,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Access to VIP and exclusive locations',
    upgradePrompt: 'Upgrade to Season plan for VIP destinations',
  },
  [FeatureId.EXCLUSIVE_DESTINATIONS]: {
    id: FeatureId.EXCLUSIVE_DESTINATIONS,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Access to ultra-exclusive and private locations',
    upgradePrompt: 'Upgrade to Year plan for exclusive destinations',
  },
  [FeatureId.EMAIL_SUPPORT]: {
    id: FeatureId.EMAIL_SUPPORT,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: false,
    description: 'Standard email support',
    upgradePrompt: 'Upgrade for priority support',
  },
  [FeatureId.PRIORITY_EMAIL_SUPPORT]: {
    id: FeatureId.PRIORITY_EMAIL_SUPPORT,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Priority email support with faster response times',
    upgradePrompt: 'Upgrade to Month plan for priority support',
  },
  [FeatureId.PHONE_SUPPORT]: {
    id: FeatureId.PHONE_SUPPORT,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Round-the-clock phone support',
    upgradePrompt: 'Upgrade to Season plan for phone support',
  },
  [FeatureId.DEDICATED_CONCIERGE]: {
    id: FeatureId.DEDICATED_CONCIERGE,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Personal concierge service',
    upgradePrompt: 'Upgrade to Year plan for dedicated concierge',
  },
  [FeatureId.MOBILE_APP_ACCESS]: {
    id: FeatureId.MOBILE_APP_ACCESS,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Access to mobile applications',
    upgradePrompt: 'Upgrade to Month plan for mobile app access',
  },
  [FeatureId.BLOG_PUBLISHING]: {
    id: FeatureId.BLOG_PUBLISHING,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Publish and manage blog posts',
    upgradePrompt: 'Upgrade to Month plan to start blogging',
  },
  [FeatureId.PREMIUM_CONTENT]: {
    id: FeatureId.PREMIUM_CONTENT,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Access to premium content and guides',
    upgradePrompt: 'Upgrade to Season plan for premium content',
  },
  [FeatureId.EXCLUSIVE_TOURS]: {
    id: FeatureId.EXCLUSIVE_TOURS,
    enabled: true,
    beta: false,
    requiresAuth: true,
    premiumOnly: true,
    description: 'Access to exclusive and private tours',
    upgradePrompt: 'Upgrade to Year plan for exclusive tours',
  },
};

/**
 * Helper functions for feature management
 */
export const getEnabledFeatures = (): FeatureId[] => {
  return Object.values(FEATURE_CONFIG)
    .filter(config => config.enabled)
    .map(config => config.id);
};

export const getBetaFeatures = (): FeatureId[] => {
  return Object.values(FEATURE_CONFIG)
    .filter(config => config.beta)
    .map(config => config.id);
};

export const getPremiumFeatures = (): FeatureId[] => {
  return Object.values(FEATURE_CONFIG)
    .filter(config => config.premiumOnly)
    .map(config => config.id);
};

export const getFeatureConfig = (featureId: FeatureId): FeatureConfig | undefined => {
  return FEATURE_CONFIG[featureId];
};

/**
 * Feature groups for UI organization
 */
export const FEATURE_GROUPS = {
  planning: [
    FeatureId.BASIC_TRIP_PLANNING,
    FeatureId.ADVANCED_TRIP_PLANNING,
    FeatureId.PREMIUM_TRIP_PLANNING,
    FeatureId.ULTIMATE_TRIP_PLANNING,
  ],
  destinations: [
    FeatureId.LIMITED_DESTINATIONS,
    FeatureId.UNLIMITED_DESTINATIONS,
    FeatureId.VIP_DESTINATIONS,
    FeatureId.EXCLUSIVE_DESTINATIONS,
  ],
  support: [
    FeatureId.EMAIL_SUPPORT,
    FeatureId.PRIORITY_EMAIL_SUPPORT,
    FeatureId.PHONE_SUPPORT,
    FeatureId.DEDICATED_CONCIERGE,
  ],
  platform: [
    FeatureId.MOBILE_APP_ACCESS,
  ],
  content: [
    FeatureId.BLOG_PUBLISHING,
    FeatureId.PREMIUM_CONTENT,
    FeatureId.EXCLUSIVE_TOURS,
  ],
} as const;
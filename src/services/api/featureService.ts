// src/services/api/featureService.ts
// ✅ UPDATED: Uses payType from localStorage instead of unavailable API

import { HttpClient } from './httpClient';
import type {
  BackendFeatureService,
  FeatureAccessResult,
  UpgradeSuggestion
} from '../../types/backend';
import { FeatureId, FEATURE_REGISTRY } from '../../types/features';
import type { ResultFeatureAccess, ResultUpgradeSuggestions, SubscriptionPlanResponse } from '../../types/api';
import { getUserPayType, hasPremiumSubscription } from '../../utils/chineseLoginStorage';
import i18n from '../../i18n';

/**
 * Feature service implementing BackendFeatureService interface
 * ✅ Now uses payType from localStorage instead of backend API
 */
export class FeatureService extends HttpClient implements BackendFeatureService {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * ✅ Map payType to accessible features
   * payType 0 (Free) = No premium features
   * payType 1-4 (VIP) = All premium features
   */
  private getFeaturesByPayType(payType: number): FeatureId[] {
    // Free users get no premium features
    if (payType === 0) {
      return [];
    }

    // VIP users (payType 1-4) get all premium features
    const allFeatures = Object.keys(FEATURE_REGISTRY) as FeatureId[];
    return allFeatures;
  }

  /**
   * Check if user has access to a specific feature
   * ✅ Uses payType from localStorage
   */
  async checkFeatureAccess(_userId: string, featureId: FeatureId): Promise<FeatureAccessResult> {
    try {
      // ✅ Get payType from localStorage
      const payType = getUserPayType() ?? 0;
      const isPremium = hasPremiumSubscription(payType);
      
      console.log('🔍 Checking feature access:', {
        featureId,
        payType,
        isPremium
      });

      const feature = FEATURE_REGISTRY[featureId];
      const featureName = feature?.name || 'This feature';

      // Free users cannot access premium features
      if (!isPremium) {
        return {
          hasAccess: false,
          featureId,
          requiredPlans: ['week', 'month', 'quarter', 'year'],
          upgradeMessage: `${featureName} is a premium feature. Upgrade to VIP to unlock it!`,
          userPlan: 'free',
        };
      }

      // VIP users can access all features
      return {
        hasAccess: true,
        featureId,
        requiredPlans: [],
        upgradeMessage: undefined,
        userPlan: payType === 1 ? 'week' : 
                 payType === 2 ? 'month' :
                 payType === 3 ? 'quarter' : 'year',
      };
      
    } catch (error) {
      console.error('Error checking feature access:', error);
      const feature = FEATURE_REGISTRY[featureId];
      const featureName = feature?.name || 'This feature';
      return {
        hasAccess: false,
        featureId,
        requiredPlans: [],
        upgradeMessage: `Unable to verify access to ${featureName.toLowerCase()}. Please try again later.`,
      };
    }
  }

  /**
   * Get all features accessible to a user
   * ✅ Uses payType from localStorage instead of API call
   */
  async getUserAccessibleFeatures(_userId: string): Promise<FeatureId[]> {
    try {
      // ✅ Get payType from localStorage (0 if not logged in)
      const payType = getUserPayType() ?? 0;
      
      console.log('📋 Getting accessible features for payType:', payType);
      
      // Map payType to features
      const accessibleFeatures = this.getFeaturesByPayType(payType);
      
      console.log('✅ User has access to:', accessibleFeatures.length, 'features');
      
      return accessibleFeatures;
      
    } catch (error) {
      console.error('Error getting accessible features:', error);
      return []; // Return empty array if error
    }
  }

  /**
   * Get upgrade suggestions for inaccessible features
   * Now uses the dedicated backend upgrade suggestions API
   */
  async getUpgradeSuggestions(
    _userId: string,
    featureIds: FeatureId[]
  ): Promise<Partial<Record<FeatureId, UpgradeSuggestion>>> {
    try {
      // Use the new backend upgrade suggestions endpoint
      const response = await this.post<ResultUpgradeSuggestions>('/api/v1/features/upgrade-suggestions', {
        featureIds
      });

      const data = response.data;

      // Convert backend response format to frontend format
      const suggestions: Partial<Record<FeatureId, UpgradeSuggestion>> = {};
      Object.entries(data).forEach(([featureId, suggestion]) => {
        suggestions[featureId as FeatureId] = {
          recommendedPlan: suggestion.recommendedPlan,
          features: suggestion.features as FeatureId[],
          price: suggestion.price,
          period: suggestion.period,
        };
      });

      return suggestions;
    } catch (error) {
      console.error('Error getting upgrade suggestions:', error);
      // Return default suggestions on error
      const suggestions: Partial<Record<FeatureId, UpgradeSuggestion>> = {};
      featureIds.forEach(featureId => {
        suggestions[featureId] = {
          recommendedPlan: 'month',
          features: [featureId],
          price: 39,
          period: 'month',
        };
      });
      return suggestions;
    }
  }

  /**
   * Get all subscription plans with their features
   * ✅ Returns hardcoded plans since we don't have backend API
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlanResponse[]> {
    try {
      const currentLang = i18n.language || 'en';
      
      // ✅ Return hardcoded subscription plans
      const plans: SubscriptionPlanResponse[] = [
        {
          planId: 'week',
          planName: currentLang === 'zh' ? '周VIP' : 'VIP Week',
          price: 19,
          durationDays: 7,
          features: Object.keys(FEATURE_REGISTRY) as FeatureId[],
          featureNames: Object.values(FEATURE_REGISTRY).map(f => f.name)
        },
        {
          planId: 'month',
          planName: currentLang === 'zh' ? '月VIP' : 'VIP Month',
          price: 39,
          durationDays: 30,
          features: Object.keys(FEATURE_REGISTRY) as FeatureId[],
          featureNames: Object.values(FEATURE_REGISTRY).map(f => f.name)
        },
        {
          planId: 'quarter',
          planName: currentLang === 'zh' ? '季度VIP' : 'VIP Quarter',
          price: 89,
          durationDays: 90,
          features: Object.keys(FEATURE_REGISTRY) as FeatureId[],
          featureNames: Object.values(FEATURE_REGISTRY).map(f => f.name)
        },
        {
          planId: 'year',
          planName: currentLang === 'zh' ? '年VIP' : 'VIP Year',
          price: 199,
          durationDays: 365,
          features: Object.keys(FEATURE_REGISTRY) as FeatureId[],
          featureNames: Object.values(FEATURE_REGISTRY).map(f => f.name)
        }
      ];
      
      console.log('📦 Returning', plans.length, 'subscription plans');
      return plans;
      
    } catch (error) {
      console.error('Error getting subscription plans:', error);
      return [];
    }
  }
}
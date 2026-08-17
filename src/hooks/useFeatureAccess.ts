// src/hooks/useFeatureAccess.ts

/**
 * FRONTEND ONLY - UX/UI Feature Access Hook
 *
 * 🚨 SECURITY WARNING: This hook provides CLIENT-SIDE feature visibility only.
 * It enhances user experience by hiding unavailable features, but provides
 * NO SECURITY. All access control MUST be enforced on the BACKEND.
 *
 * Backend Implementation Required:
 * - See src/types/backend.ts for BackendFeatureService interface
 * - Implement server-side access validation for all protected routes
 * - Use middleware to check feature access before processing requests
 *
 * Migration: Replace mock data with real API calls to backend services.
 */

import { useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from './useSubscription';
import type { FeatureId, FeatureAccessResult } from '../types/features';
import { FEATURE_REGISTRY } from '../types/features';
import { apiClient } from '../services/apiClient';

/**
 * Hook for checking feature access based on user subscription
 * Provides a clean API for components to check if features are available
 */
export const useFeatureAccess = () => {
  const { user } = useAuth();
  const { userSubscription } = useSubscription();

  const checkFeatureAccess = useCallback(async (featureId: FeatureId): Promise<FeatureAccessResult> => {
    if (!user) {
      const feature = FEATURE_REGISTRY[featureId];
      return {
        hasAccess: false,
        feature: feature || {
          id: featureId,
          name: 'Unknown Feature',
          description: 'Feature not found',
          category: 'planning',
        },
        requiredPlans: [],
        userPlan: undefined,
        upgradeMessage: 'Authentication required',
      };
    }

    // Use API service for feature access checking
    const result = await apiClient.checkFeatureAccess(user.uid, featureId);

    // Map backend response to frontend format by adding feature info
    const feature = FEATURE_REGISTRY[featureId];
    return {
      ...result,
      feature: feature || {
        id: featureId,
        name: 'Unknown Feature',
        description: 'Feature not found',
        category: 'planning',
      },
    };
  }, [user]);

  const hasFeatureAccess = useCallback(async (featureId: FeatureId): Promise<boolean> => {
    const access = await checkFeatureAccess(featureId);
    return access.hasAccess;
  }, [checkFeatureAccess]);

  const getAccessibleFeatures = useCallback(async (): Promise<FeatureId[]> => {
    if (!user) {
      return [];
    }

    // Use API to get accessible features
   const features = await apiClient.getAccessibleFeatures(user.uid);
return features as FeatureId[];
  }, [user]);

  const getUpgradeSuggestions = useCallback(async (featureIds: FeatureId[]): Promise<Partial<Record<FeatureId, { recommendedPlan: string; features: FeatureId[]; price: number; period: string }>>> => {
    if (!user) {
      // Return empty suggestions for all features if not authenticated
      const suggestions: Partial<Record<FeatureId, { recommendedPlan: string; features: FeatureId[]; price: number; period: string }>> = {};
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

    // Use API client for upgrade suggestions
    const suggestions = await apiClient.getUpgradeSuggestions(user.uid, featureIds);
    return suggestions;
  }, [user]);

  return useMemo(() => ({
    checkFeatureAccess,
    hasFeatureAccess,
    getAccessibleFeatures,
    getUpgradeSuggestions,
    userPlan: userSubscription?.planId,
    isSubscribed: userSubscription?.status === 'active',
  }), [checkFeatureAccess, hasFeatureAccess, getAccessibleFeatures, getUpgradeSuggestions, userSubscription?.planId, userSubscription?.status]);
};
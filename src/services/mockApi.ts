// src/services/mockApi.ts

/**
 * MOCK API SERVICE - Simulated Backend Responses
 *
 * This service simulates the backend API responses for development and testing.
 * It implements the same interfaces as the real backend services, making it
 * easy to replace with real API calls when the backend is ready.
 *
 * 🚨 MIGRATION NOTE: When backend is ready, replace this file's implementations
 * with real fetch() calls to your API endpoints. The interfaces and response
 * formats will remain the same.
 */

import type {
  BackendSubscriptionService,
  BackendFeatureService,
  SubscriptionUpdateResult,
  FeatureAccessResult,
  UpdateSubscriptionRequest,
} from '../types/backend';
import { FeatureId, FEATURE_PLAN_MAPPING, getUpgradePlan } from '../types/features';
import type { UserSubscription } from '../types/subscription';
import { mockUserSubscription } from '../types/subscription';
import type { TripSettings, Trip, Place, Weather, Route, ClothingSuggestion } from '../types/trip';

// Simulate network delay
const simulateDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Generate clothing suggestions based on weather condition and temperature
const generateClothingSuggestions = (condition: string, temperature: number): ClothingSuggestion[] => {
  const lowerCondition = condition.toLowerCase();
  const suggestions: ClothingSuggestion[] = [];

  // Base suggestions based on temperature
  if (temperature >= 25) {
    suggestions.push({
      name: 'T-shirt',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M21.75 8L20 9.75V19.75C20 20.1642 19.6642 20.5 19.25 20.5H4.75C4.33579 20.5 4 20.1642 4 19.75V9.75L2.25 8L7 3.25C7 3.25 7 5.5 9.25 5.5H14.75C17 5.5 17 3.25 17 3.25L21.75 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
    });
    suggestions.push({
      name: 'Shorts',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M5 10V20C5 20.5523 5.44772 21 6 21H8C8.55228 21 9 20.5523 9 20V16H15V20C15 20.5523 15.4477 21 16 21H18C18.5523 21 19 20.5523 19 20V10H5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
    suggestions.push({
      name: 'Sunglasses',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M2 9H3.5C4.5 6 6.5 4 9.5 4C11.5 4 13 5 13.5 6C14 5 15.5 4 17.5 4C20.5 4 22.5 6 23.5 9H22C21.5 7 20.5 5 18.5 5C16.5 5 15.5 6.5 15.5 9H13.5C13.5 6.5 12.5 5 10.5 5C8.5 5 7.5 7 7 9H2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3 9C3 9 3 13 7 13C11 13 11 9 11 9M13 9C13 9 13 13 17 13C21 13 21 9 21 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
    });
  } else if (temperature >= 15) {
    suggestions.push({
      name: 'Light jacket',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 10L6 3H18L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 3V6H14V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
    suggestions.push({
      name: 'Jeans',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M5 4V20C5 20.5523 5.44772 21 6 21H8C8.55228 21 9 20.5523 9 20V13H15V20C15 20.5523 15.4477 21 16 21H18C18.5523 21 19 20.5523 19 20V4H5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3 4H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 4V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 4V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
    suggestions.push({
      name: 'Sneakers',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M2 18V13C2 12.4477 2.44772 12 3 12H21C21.5523 12 22 12.4477 22 13V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M5 12V8C5 7.44772 5.44772 7 6 7H11L14 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 12L19 8H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 15H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 15H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 15H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
  } else {
    suggestions.push({
      name: 'Winter coat',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 11L6 3H18L21 11V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3 11H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 11V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 11V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 3V7H14V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
    suggestions.push({
      name: 'Sweater',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 9L6 3H18L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3 9H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 3V6H14V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12L8 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 12L16 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
    suggestions.push({
      name: 'Boots',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 9V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H6C4.89543 7 4 7.89543 4 9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M8 7V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 12H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
  }

  // Additional suggestions based on condition
  if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
    suggestions.push({
      name: 'Umbrella',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12H22C22 6.48 17.52 2 12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M12 12V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 20H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
    suggestions.push({
      name: 'Raincoat',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 10L6 3H18L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 3V6H14V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 10V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
  } else if (lowerCondition.includes('snow')) {
    suggestions.push({
      name: 'Gloves',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 12V7C7 5.89543 7.89543 5 9 5H15C16.1046 5 17 5.89543 17 7V12C17 13.1046 16.1046 14 15 14H9C7.89543 14 7 13.1046 7 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M9 5V3C9 2.44772 9.44772 2 10 2H14C14.5523 2 15 2.44772 15 3V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 8H5C4.44772 8 4 8.44772 4 9V11C4 11.5523 4.44772 12 5 12H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 8H19C19.5523 8 20 8.44772 20 9V11C20 11.5523 19.5523 12 19 12H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 14V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 14V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
    suggestions.push({
      name: 'Scarf',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 7C19 4.79086 17.2091 3 15 3H9C6.79086 3 5 4.79086 5 7V17C5 19.2091 6.79086 21 9 21H15C17.2091 21 19 19.2091 19 17V7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M5 7H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 17H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
  } else if (lowerCondition.includes('wind')) {
    suggestions.push({
      name: 'Windbreaker',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 10L6 3H18L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 3V6H14V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 14H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    });
  }

  return suggestions.slice(0, 4); // Limit to 4 suggestions
};
// Mock user database (in real backend, this would be in database)
const mockUserSubscriptions = new Map<string, UserSubscription>();

// Initialize with some test data
mockUserSubscriptions.set('user123', {
  ...mockUserSubscription,
  userId: 'user123',
  planId: 'week',
  status: 'active',
});

mockUserSubscriptions.set('premium_user', {
  ...mockUserSubscription,
  userId: 'premium_user',
  planId: 'year',
  status: 'active',
});

/**
 * Mock Subscription Service - Simulates BackendSubscriptionService
 */
export class MockSubscriptionService implements BackendSubscriptionService {
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    await simulateDelay();

    // Simulate different user scenarios
    if (userId === 'no_subscription') {
      return null; // User without subscription
    }

    if (userId === 'expired_user') {
      return {
        ...mockUserSubscription,
        userId,
        status: 'expired',
        endDate: new Date('2024-01-01'), // Past date
      };
    }

    // Return mock subscription or null
    return mockUserSubscriptions.get(userId) || null;
  }

  async updateSubscription(
    userId: string,
    planId: string,
    paymentMethodId?: string
  ): Promise<SubscriptionUpdateResult> {
    await simulateDelay(1000); // Simulate payment processing delay

    // Simulate payment failure for testing
    if (planId === 'fail_payment') {
      return {
        success: false,
        subscription: {} as UserSubscription,
        error: 'Payment method declined',
      };
    }

    // Simulate successful subscription update
    const updatedSubscription: UserSubscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      autoRenew: true,
      paymentMethodId: paymentMethodId || 'pm_mock123',
    };

    // Update mock database
    mockUserSubscriptions.set(userId, updatedSubscription);

    return {
      success: true,
      subscription: updatedSubscription,
    };
  }

  async cancelSubscription(userId: string, reason?: string): Promise<void> {
    await simulateDelay();

    const subscription = mockUserSubscriptions.get(userId);
    if (!subscription) {
      throw new Error('No active subscription found');
    }
    console.log('Cancelling subscription:', subscription, "Reason: ", reason);


    // Mark for cancellation at period end
    const updatedSubscription: UserSubscription = {
      ...subscription,
      autoRenew: false,
    };

    mockUserSubscriptions.set(userId, updatedSubscription);
  }
}

/**
 * Mock Feature Service - Simulates BackendFeatureService
 */
export class MockFeatureService implements BackendFeatureService {
  async checkFeatureAccess(userId: string, featureId: FeatureId): Promise<FeatureAccessResult> {
    await simulateDelay(200); // Quick feature checks

    const subscription = await mockSubscriptionService.getUserSubscription(userId);
    const requiredPlans = FEATURE_PLAN_MAPPING[featureId];

    if (!requiredPlans) {
      return {
        hasAccess: false,
        featureId,
        requiredPlans: [],
      };
    }

    if (!subscription || subscription.status !== 'active') {
      return {
        hasAccess: false,
        featureId,
        requiredPlans,
        userPlan: subscription?.planId,
      };
    }

    const userPlanId = subscription.planId;
    const hasAccess = requiredPlans.includes(userPlanId);

    if (hasAccess) {
      return {
        hasAccess: true,
        featureId,
        requiredPlans,
        userPlan: userPlanId,
      };
    }

    // Find upgrade suggestion
    const upgradePlan = getUpgradePlan(userPlanId, requiredPlans);

    return {
      hasAccess: false,
      featureId,
      requiredPlans,
      userPlan: userPlanId,
      upgradeSuggestion: upgradePlan ? {
        recommendedPlan: upgradePlan,
        features: [featureId],
        price: 0, // Mock price
        period: 'month',
      } : undefined,
    };
  }

  async getUserAccessibleFeatures(userId: string): Promise<FeatureId[]> {
    await simulateDelay();

    const subscription = await mockSubscriptionService.getUserSubscription(userId);

    if (!subscription || subscription.status !== 'active') {
      return [];
    }

    return Object.entries(FEATURE_PLAN_MAPPING)
      .filter(([, plans]) => plans.includes(subscription.planId))
      .map(([featureId]) => featureId as FeatureId);
  }

  async getUpgradeSuggestions(
    userId: string,
    featureIds: FeatureId[]
  ): Promise<Record<FeatureId, { recommendedPlan: string; features: FeatureId[]; price: number; period: string }>> {
    await simulateDelay();

    const subscription = await mockSubscriptionService.getUserSubscription(userId);
    const suggestions = {} as Record<FeatureId, { recommendedPlan: string; features: FeatureId[]; price: number; period: string }>;

    if (!subscription || subscription.status !== 'active') {
      // Return empty suggestions for all features
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

    featureIds.forEach(featureId => {
      const requiredPlans = FEATURE_PLAN_MAPPING[featureId];
      const upgradePlan = getUpgradePlan(subscription.planId, requiredPlans);

      suggestions[featureId] = upgradePlan ? {
        recommendedPlan: upgradePlan,
        features: [featureId],
        price: upgradePlan === 'month' ? 39 : upgradePlan === 'season' ? 89 : 199,
        period: 'month',
      } : {
        recommendedPlan: 'month',
        features: [featureId],
        price: 39,
        period: 'month',
      };
    });

    return suggestions;
  }
}

// Create singleton instances (in real app, these would be injected)
export const mockSubscriptionService = new MockSubscriptionService();
export const mockFeatureService = new MockFeatureService();

/**
 * MOCK API CLIENT - Simulates HTTP requests
 *
 * This simulates the API client that would make real HTTP requests.
 * When backend is ready, replace the implementations with fetch() calls.
 */
export class MockApiClient {
  private subscriptionService = mockSubscriptionService;
  private featureService = mockFeatureService;

  // Simulate GET /api/subscriptions/me
  async getSubscription(userId: string) {
    try {
      const subscription = await this.subscriptionService.getUserSubscription(userId);
      return {
        success: true,
        data: subscription,
      };
    } catch {
      return {
        success: false,
        error: { message: 'Failed to fetch subscription' },
      };
    }
  }

  // Simulate POST /api/subscriptions/update
  async updateSubscription(userId: string, request: UpdateSubscriptionRequest) {
    try {
      const result = await this.subscriptionService.updateSubscription(
        userId,
        request.planId,
        request.paymentMethodId
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to update subscription' },
      };
    }
  }

  // Simulate POST /api/subscriptions/cancel
  async cancelSubscription(userId: string, reason?: string) {
    try {
      await this.subscriptionService.cancelSubscription(userId, reason);
      return {
        success: true,
        message: 'Subscription cancelled successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Failed to cancel subscription' },
      };
    }
  }

  // Simulate GET /api/features/:featureId/access
  async checkFeatureAccess(userId: string, featureId: FeatureId) {
    try {
      const result = await this.featureService.checkFeatureAccess(userId, featureId);
      return {
        success: true,
        data: result,
      };
    } catch {
      return {
        success: false,
        error: { message: 'Failed to check feature access' },
      };
    }
  }

  // Simulate GET /api/features/accessible
  async getAccessibleFeatures(userId: string) {
    try {
      const features = await this.featureService.getUserAccessibleFeatures(userId);
      return {
        success: true,
        data: features,
      };
    } catch {
      return {
        success: false,
        error: { message: 'Failed to fetch accessible features' },
      };
    }
  }

  // Simulate GET /api/features/upgrade-suggestions
  async getUpgradeSuggestions(userId: string, featureIds: FeatureId[]) {
    try {
      const suggestions = await this.featureService.getUpgradeSuggestions(userId, featureIds);
      return {
        success: true,
        data: suggestions,
      };
    } catch {
      return {
        success: false,
        error: { message: 'Failed to fetch upgrade suggestions' },
      };
    }
  }

  // Trip-related mock services
  async generateTrip(settings: TripSettings): Promise<Trip> {
    await simulateDelay(1500); // Simulate longer processing for trip generation

    // Base coordinates for Copenhagen (can be made dynamic based on destination)
    const baseLat = 55.6761;
    const baseLng = 12.5683;

    // Generate random image URLs using Lorem Picsum
    const generateRandomImage = (width: number = 400, height: number = 300, seed?: string) => {
      const baseUrl = 'https://picsum.photos';
      const seedParam = seed ? `?random=${seed}` : '';
      return `${baseUrl}/${width}/${height}${seedParam}`;
    };

    // Generate places based on interests and destination
    const allPossiblePlaces: Record<string, Array<{name: string, description: string, category: 'park' | 'beach' | 'attraction' | 'museum' | 'nature', image: string}>> = {
      'outdoorsSport': [
        { name: 'Dyrehaven', description: 'Beautiful forest and park area perfect for outdoor activities', category: 'park' as const, image: generateRandomImage(400, 300, 'forest1') },
        { name: 'Amager Strandpark', description: 'Urban beach and recreational area with sports facilities', category: 'beach' as const, image: generateRandomImage(400, 300, 'beach1') },
        { name: 'Superkilen Park', description: 'Unique multicultural park with recreational spaces', category: 'park' as const, image: generateRandomImage(400, 300, 'park1') },
        { name: 'Kastellet', description: 'Historic fort and park with walking paths', category: 'attraction' as const, image: generateRandomImage(400, 300, 'fort1') },
        { name: 'Fælledparken', description: 'Large urban park for sports and relaxation', category: 'park' as const, image: generateRandomImage(400, 300, 'park2') },
      ],
      'cultureMuseum': [
        { name: 'Amalienborg Palace', description: 'Royal residence and museum showcasing Danish history', category: 'museum' as const, image: generateRandomImage(400, 300, 'palace1') },
        { name: 'Charlottenlund Palace', description: 'Historic palace with beautiful gardens and art collections', category: 'museum' as const, image: generateRandomImage(400, 300, 'palace2') },
        { name: 'The Open Air Museum', description: 'Living history museum with traditional Danish buildings', category: 'museum' as const, image: generateRandomImage(400, 300, 'museum1') },
        { name: 'Ny Carlsberg Glyptotek', description: 'Art museum with sculpture garden and international collections', category: 'museum' as const, image: generateRandomImage(400, 300, 'museum2') },
        { name: 'Christiansborg Palace', description: 'Parliament and royal palace with guided tours', category: 'museum' as const, image: generateRandomImage(400, 300, 'palace3') },
      ],
      'fjordsMountains': [
        { name: 'Roskilde Fjord', description: 'Beautiful fjord area with scenic views and water activities', category: 'nature' as const, image: generateRandomImage(400, 300, 'fjord1') },
        { name: 'Vejle Fjord', description: 'Scenic fjord landscape perfect for nature walks', category: 'nature' as const, image: generateRandomImage(400, 300, 'fjord2') },
        { name: 'Møns Klint', description: 'Dramatic chalk cliffs and pristine nature reserves', category: 'nature' as const, image: generateRandomImage(400, 300, 'cliffs1') },
        { name: 'Himmelbjerget', description: 'Highest natural point in Denmark with panoramic views', category: 'nature' as const, image: generateRandomImage(400, 300, 'mountain1') },
        { name: 'Gribskov', description: 'Ancient forest area with hiking trails and wildlife', category: 'nature' as const, image: generateRandomImage(400, 300, 'forest2') },
      ],
    };

    // Collect places based on selected interests
    let selectedPlaces: Array<{name: string, description: string, category: 'park' | 'beach' | 'attraction' | 'museum' | 'nature', image: string}> = [];
    settings.preferences.forEach(interest => {
      const places = allPossiblePlaces[interest as keyof typeof allPossiblePlaces] || [];
      selectedPlaces = selectedPlaces.concat(places);
    });

    // If no interests selected, use a default mix
    if (selectedPlaces.length === 0) {
      selectedPlaces = [
        ...allPossiblePlaces['outdoorsSport'].slice(0, 2),
        ...allPossiblePlaces['cultureMuseum'].slice(0, 2),
        ...allPossiblePlaces['fjordsMountains'].slice(0, 1),
      ];
    }

    // Limit to stations count and shuffle
    const shuffledPlaces = selectedPlaces.sort(() => 0.5 - Math.random());
    const finalPlaces = shuffledPlaces.slice(0, settings.preferences.length > 0 ? Math.min(settings.preferences.length * 2, settings.preferences.length === 1 ? 4 : 6) : 4);

    // Generate coordinates around Copenhagen with some variation
    const mockPlaces: Place[] = finalPlaces.map((place, index) => {
      const latOffset = (Math.random() - 0.5) * 0.1; // ±0.05 degrees
      const lngOffset = (Math.random() - 0.5) * 0.1;
      return {
        id: `place_${index + 1}`,
        name: place.name,
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset,
        description: place.description,
        category: place.category,
        image: place.image,
      };
    });

    // Create route waypoints in order of places
    const waypoints = mockPlaces.map(place => ({ lat: place.lat, lng: place.lng }));

    // Calculate total distance (simplified)
    let totalDistance = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const prev = waypoints[i - 1];
      const curr = waypoints[i];
      const distance = Math.sqrt((curr.lat - prev.lat) ** 2 + (curr.lng - prev.lng) ** 2) * 111; // rough km
      totalDistance += distance;
    }

    const mockRoute: Route = {
      waypoints,
      distance: Math.round(totalDistance * 10) / 10,
      duration: Math.round(totalDistance * 3), // assume 20 km/h average speed
    };

    const mockWeather: Weather = {
      location: settings.destination,
      temperature: 15 + Math.floor(Math.random() * 10), // 15-25°C
      condition: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain'][Math.floor(Math.random() * 4)],
      humidity: 50 + Math.floor(Math.random() * 30), // 50-80%
      forecast: Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          date: date.toISOString().split('T')[0],
          temp: 15 + Math.floor(Math.random() * 10),
          condition: ['Sunny', 'Partly cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
        };
      }),
      clothing: generateClothingSuggestions('Partly cloudy', 20),
    };

    return {
      id: 'trip_' + Date.now(),
      settings,
      places: mockPlaces,
      route: mockRoute,
      weather: mockWeather,
      createdAt: new Date(),
    };
  }

  async getPlaces(): Promise<Place[]> {
    await simulateDelay();
    return [
      { id: '1', name: 'Central Park', lat: 40.7829, lng: -73.9654, description: 'Large public park in NYC', category: 'park' },
      { id: '2', name: 'Times Square', lat: 40.7580, lng: -73.9855, description: 'Bustling commercial intersection', category: 'attraction' },
      { id: '3', name: 'Statue of Liberty', lat: 40.6892, lng: -74.0445, description: 'Iconic statue and museum', category: 'attraction' },
    ];
  }

  async getWeather(location: string, time?: string): Promise<Weather> {
    await simulateDelay();
    let temperature = 22;
    let condition = 'Sunny';
    let humidity = 60;

    // Generate time-specific weather data if time is provided
    if (time) {
      const timeDate = new Date(time);
      const hour = timeDate.getHours();

      // Adjust temperature and condition based on time of day
      if (hour >= 6 && hour < 12) {
        temperature = 20; // Morning
        condition = 'Partly cloudy';
        humidity = 65;
      } else if (hour >= 12 && hour < 18) {
        temperature = 25; // Afternoon
        condition = 'Sunny';
        humidity = 55;
      } else if (hour >= 18 && hour < 22) {
        temperature = 18; // Evening
        condition = 'Clear';
        humidity = 70;
      } else {
        temperature = 15; // Night
        condition = 'Clear';
        humidity = 75;
      }
    }

    return {
      location,
      temperature,
      condition,
      humidity,
      forecast: [
        { date: new Date().toISOString().split('T')[0], temp: temperature, condition },
        { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], temp: temperature + 2, condition: 'Clear' },
        { date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], temp: temperature - 2, condition: 'Cloudy' },
        { date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], temp: temperature + 1, condition: 'Partly cloudy' },
        { date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], temp: temperature - 1, condition: 'Rainy' },
      ],
      clothing: generateClothingSuggestions(condition, temperature),
    };
  }

  async getRoute(waypoints: { lat: number; lng: number }[]): Promise<Route> {
    await simulateDelay();
    const distance = waypoints.length > 1 ? waypoints.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return acc;
      const prev = arr[idx - 1];
      // Simple distance calculation (not accurate, just mock)
      const dist = Math.sqrt((curr.lat - prev.lat) ** 2 + (curr.lng - prev.lng) ** 2) * 111; // rough km
      return acc + dist;
    }, 0) : 0;
    return {
      waypoints,
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(distance * 2), // assume 30 km/h average
    };
  }
}

// Export singleton API client
export const mockApiClient = new MockApiClient();

/**
 * MIGRATION INSTRUCTIONS
 * ======================
 *
 * When your real backend is ready, replace this file with:
 *
 * ```typescript
 * // src/services/apiClient.ts
 * import { BackendSubscriptionService, BackendFeatureService } from '../types/backend';
 *
 * export class RealApiClient {
 *   async getSubscription(userId: string) {
 *     const response = await fetch(`/api/subscriptions/me`, {
 *       headers: { Authorization: `Bearer ${token}` },
 *     });
 *     return response.json();
 *   }
 *
 *   async updateSubscription(userId: string, request: UpdateSubscriptionRequest) {
 *     const response = await fetch(`/api/subscriptions/update`, {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         Authorization: `Bearer ${token}`,
 *       },
 *       body: JSON.stringify(request),
 *     });
 *     return response.json();
 *   }
 *
 *   // ... implement all other methods
 * }
 *
 * export const apiClient = new RealApiClient();
 * ```
 *
 * Then update the imports in your hooks from `mockApiClient` to `apiClient`.
 */
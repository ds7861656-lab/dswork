// src/hooks/queries/useSubscriptionQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedSubscriptionService } from '../../services/subscription/UnifiedSubscriptionService';
import { QUERY_KEYS } from '../../lib/react-query/queryKeys';

// 1. Fetch Plans
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: QUERY_KEYS.subscription.plans(),
    queryFn: () => unifiedSubscriptionService.getSubscriptionPlans(),
    staleTime: 1000 * 60 * 60, // Plans rarely change, cache for 1 hour
  });
};

// 2. Fetch User Subscription
export const useUserSubscription = (userId: string | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.subscription.currentUser(userId || ''),
    queryFn: async () => {
      try {
        return await unifiedSubscriptionService.getUserSubscription(userId!);
      } catch (error) {
        // Handle empty response errors gracefully - treat as no subscription
        if (error instanceof Error && error.message.includes('Empty response body')) {
          console.log(`No subscription found for user ${userId} (empty response)`);
          return null;
        }
        // Re-throw other errors
        throw error;
      }
    },
    enabled: !!userId, // Only fetch if user is logged in
  });
};

// 3. Mutation: Purchase VIP
export const usePurchaseSubscription = () => {
  return useMutation({
    mutationFn: async ({ userId, planId, paymentMethod }: { userId: string, planId: string, paymentMethod: 'alipay' | 'stripe' }) => {
      return unifiedSubscriptionService.purchaseVip(userId, planId, paymentMethod);
    },
    // Note: We don't invalidate queries yet because payment is async (redirects or popups)
  });
};

// 4. Mutation: Cancel Subscription
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string, reason?: string }) => {
      return unifiedSubscriptionService.cancelSubscription(userId, reason);
    },
    onSuccess: (_, variables) => {
      // Optimistic update or refetch
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.subscription.currentUser(variables.userId) 
      });
    },
  });
};

// 5. Check Payment Status
export const useCheckPaymentStatus = (orderNo: string | undefined) => {
  return useQuery({
    queryKey: ['payment-status', orderNo],
    queryFn: () => unifiedSubscriptionService.checkPaymentStatus(orderNo!),
    enabled: !!orderNo,
    retry: false, // Don't retry payment status checks
  });
};

// 6. Handle Payment Return
export const useHandlePaymentReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, orderNo }: { userId: string, orderNo: string }) => {
      return unifiedSubscriptionService.handlePaymentReturn(userId, orderNo);
    },
    onSuccess: (_, variables) => {
      // Refresh user subscription after successful payment
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.subscription.currentUser(variables.userId) 
      });
    },
  });
};

// 7. Get VIP Orders
export const useVipOrders = (params?: { current?: number; size?: number }) => {
  return useQuery({
    queryKey: ['vip-orders', params],
    queryFn: () => unifiedSubscriptionService.getVipOrders(params),
  });
};

// 8. Cancel VIP Order
export const useCancelVipOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderNo: string) => unifiedSubscriptionService.cancelVipOrder(orderNo),
    onSuccess: () => {
      // Refresh orders list
      queryClient.invalidateQueries({ queryKey: ['vip-orders'] });
    },
  });
};

// 9. Activate Free Trial
export const useActivateFreeTrial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unifiedSubscriptionService.activateFreeTrial(),
    onSuccess: () => {
      // Could invalidate user subscription or other relevant queries
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
};
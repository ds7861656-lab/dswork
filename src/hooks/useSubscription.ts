// src/hooks/useSubscription.ts

/**
 * FRONTEND ONLY - UX/UI Subscription Management Hook
 * 
 * Updated to use TanStack Query for Server State management
 * Replaces manual useState/useEffect/caching with React Query hooks
 */

import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../contexts/SnackbarContext';
import {
  useSubscriptionPlans,
  useUserSubscription,
  usePurchaseSubscription,
  useCancelSubscription,
  useHandlePaymentReturn
} from './queries/useSubscriptionQueries';

export const useSubscription = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { showSuccess, showError } = useSnackbar();

  // UI Local State (things that don't belong in Server State)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  // --- React Query Hooks ---
  
  // 1. Get Plans
  const { 
    data: plans = [], 
    isLoading: isLoadingPlans
  } = useSubscriptionPlans();

  // 2. Get User Subscription
  const { 
    data: userSubscription, 
    isLoading: isLoadingSub,
    refetch: refetchSubscription
  } = useUserSubscription(user?.uid);

  // 3. Mutations
  const purchaseMutation = usePurchaseSubscription();
  const cancelMutation = useCancelSubscription();
  const handlePaymentReturnMutation = useHandlePaymentReturn();

  // --- Handlers ---

  const handlePlanSelect = useCallback((planId: string) => {
    setSelectedPlanId(planId);
  }, []);

  const handlePlanUpdate = useCallback((planId: string) => {
    if (!user) {
      showError(t('subscription.error.loginRequired'));
      return;
    }
    // Prevent selecting current plan
    if (userSubscription?.planId === planId) {
      showError(t('subscription.error.alreadySubscribed'));
      return;
    }
    setPendingPlanId(planId);
    setShowPaymentMethodSelection(true);
  }, [user, userSubscription, showError, t]);

  const handlePaymentMethodSelect = useCallback(async (planId: string, paymentMethod: 'alipay' | 'stripe') => {
    if (!user) return;
    
    // Close modal
    setShowPaymentMethodSelection(false);
    setPendingPlanId(null);

    // Trigger Mutation
    purchaseMutation.mutate(
      { userId: user.uid, planId, paymentMethod },
      {
        onSuccess: (result) => {
           console.log('Payment initiation result:', result);
           if (result.success) {
            // Store payment context for return handling
            sessionStorage.setItem('pendingPayment', JSON.stringify({
              orderNo: result.orderNo,
              planId,
              paymentMethod,
              timestamp: Date.now()
            }));

            if (paymentMethod === 'alipay' && result.paymentHtml) {
              // SECURE ALIPAY FLOW: Create blob URL and open in new tab (avoids popup blockers and cookie issues)
              try {
                // Create a complete HTML document with the payment form
                const paymentPageHtml = `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Alipay Payment - ${result.orderNo}</title>
                      <style>
                        body {
                          margin: 0;
                          padding: 20px;
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                          background: #f5f5f5;
                        }
                        .container {
                          max-width: 800px;
                          margin: 0 auto;
                          background: white;
                          border-radius: 8px;
                          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                          overflow: hidden;
                        }
                        .header {
                          background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
                          color: white;
                          padding: 20px;
                          text-align: center;
                        }
                        .content {
                          padding: 20px;
                        }
                        .loading {
                          text-align: center;
                          padding: 40px;
                          color: #666;
                        }
                        .spinner {
                          border: 4px solid #f3f3f3;
                          border-top: 4px solid #1677ff;
                          border-radius: 50%;
                          width: 40px;
                          height: 40px;
                          animation: spin 1s linear infinite;
                          margin: 0 auto 20px;
                        }
                        @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                        .instructions {
                          background: #f0f8ff;
                          border: 1px solid #b3d9ff;
                          border-radius: 4px;
                          padding: 15px;
                          margin-bottom: 20px;
                        }
                        .order-info {
                          background: #f6ffed;
                          border: 1px solid #b7eb8f;
                          border-radius: 4px;
                          padding: 15px;
                          margin-bottom: 20px;
                        }
                      </style>
                      <script>
                        // Auto-submit the payment form when page loads
                        window.addEventListener('DOMContentLoaded', function() {
                          const forms = document.querySelectorAll('form');
                          if (forms.length > 0) {
                            // Add loading indicator
                            const loadingDiv = document.querySelector('.loading');
                            if (loadingDiv) {
                              loadingDiv.innerHTML = '<div class="spinner"></div><h3>Redirecting to Alipay...</h3><p>Please wait while we securely redirect you to complete your payment.</p>';
                            }
                            // Auto-submit the first form after a short delay
                            setTimeout(() => {
                              forms[0].submit();
                            }, 1000);
                          }
                        });

                        // Handle page visibility changes to detect when user returns
                        document.addEventListener('visibilitychange', function() {
                          if (!document.hidden) {
                            // User has returned to this tab - they might have completed payment
                            // We'll let the parent window handle the payment verification
                          }
                        });
                      </script>
                    </head>
                    <body>
                      <div class="container">
                        <div class="header">
                          <h1>Secure Payment</h1>
                          <p>Processing your Alipay payment...</p>
                        </div>
                        <div class="content">
                          <div class="order-info">
                            <strong>Order Number:</strong> ${result.orderNo}
                          </div>
                          <div class="instructions">
                            <strong>Instructions:</strong>
                            <ul>
                              <li>You will be automatically redirected to Alipay's secure payment page</li>
                              <li>Complete your payment on Alipay</li>
                              <li>Return to this tab after payment completion</li>
                              <li>The payment status will be verified automatically</li>
                            </ul>
                          </div>
                          <div class="loading">
                            <div class="spinner"></div>
                            <h3>Preparing Payment...</h3>
                            <p>Please wait while we connect you to Alipay securely.</p>
                          </div>
                          <!-- Payment HTML from backend -->
                          ${result.paymentHtml}
                        </div>
                      </div>
                    </body>
                  </html>
                `;

                // Create blob URL for the payment page
                const blob = new Blob([paymentPageHtml], { type: 'text/html' });
                const paymentUrl = URL.createObjectURL(blob);

                // Open in new tab (not popup) - this avoids popup blockers
                const paymentTab = window.open(paymentUrl, '_blank');

                if (paymentTab) {
                  // Monitor tab close and check payment status
                  const checkClosed = setInterval(() => {
                    if (paymentTab.closed) {
                      clearInterval(checkClosed);
                      URL.revokeObjectURL(paymentUrl); // Clean up blob URL
                      // Check payment status after tab closes
                      handlePaymentReturn(result.orderNo!);
                    }
                  }, 1000);

                  // Also check periodically for payment completion (in case user keeps tab open)
                  const checkPayment = setInterval(() => {
                    if (paymentTab.closed) {
                      clearInterval(checkPayment);
                      return;
                    }
                    // Check if payment is complete (this could be enhanced with more sophisticated detection)
                    handlePaymentReturn(result.orderNo!);
                  }, 5000); // Check every 5 seconds

                  // Clean up intervals after 10 minutes (timeout)
                  setTimeout(() => {
                    clearInterval(checkClosed);
                    clearInterval(checkPayment);
                    if (!paymentTab.closed) {
                      paymentTab.close();
                      URL.revokeObjectURL(paymentUrl);
                    }
                  }, 600000); // 10 minutes

                } else {
                  // Fallback: If tab opening fails, show instructions to user
                  showError(t('subscription.error.popupBlocked'));
                  URL.revokeObjectURL(paymentUrl); // Clean up
                }

              } catch (error) {
                console.error('Error creating payment page:', error);
                showError(t('subscription.error.updateFailed'));
              }
            } else if (paymentMethod === 'stripe' && result.clientSecret) {
              // NEW STRIPE FLOW: Use Stripe.js for on-site payment confirmation
              console.log('Stripe client secret received:', result.clientSecret);

              // TODO: Implement proper Stripe.js integration
              // For now, we'll show an error since this requires Stripe.js setup
              showError(t('subscription.error.paymentFailed'));
            } else if (paymentMethod === 'stripe' && result.paymentUrl) {
              // LEGACY STRIPE FLOW: Redirect to payment URL
              window.location.href = result.paymentUrl;
            } else {
              showError(t('subscription.error.paymentFailed'));
            }
          } else {
            showError(result.error || t('subscription.error.paymentFailed'));
          }
        },
        onError: (error) => {
          showError(error instanceof Error ? error.message : t('subscription.error.updateFailed'));
        }
      }
    );
  }, [user, purchaseMutation, showSuccess]);

  const handleCancelSubscription = useCallback((reason?: string) => {
    if (!user) return;
    
    cancelMutation.mutate(
      { userId: user.uid, reason },
      {
        onSuccess: () => {
          showSuccess(
            i18n.t('subscription.success.cancelSuccess') || 'Subscription cancelled successfully. Your access will continue until the end of the current billing period.'
          );
        },
        onError: (error) => {
          showError(error instanceof Error ? error.message : t('subscription.error.cancelFailed'));
        }
      }
    );
  }, [user, cancelMutation, showSuccess, i18n]);

  // Manual Refresh (Useful for the Return Page)
  const refreshSubscription = useCallback(async () => {
    await refetchSubscription();
  }, [refetchSubscription]);

  // Handle Payment Return Status Check
  const handlePaymentReturn = useCallback(async (orderNo: string) => {
    if (!user) return;

    handlePaymentReturnMutation.mutate(
      { userId: user.uid, orderNo },
      {
        onSuccess: (result) => {
          if (result.success && result.subscription) {
            // Payment successful, refresh subscription data
            refreshSubscription();
            showSuccess(
              i18n.t('subscription.success.paymentCompleted') || 'Payment completed successfully!'
            );
          } else {
            showError(result.error || t('subscription.error.paymentNotCompleted'));
          }
        },
        onError: (error) => {
          showError(error instanceof Error ? error.message : t('subscription.error.paymentStatusCheckFailed'));
        }
      }
    );
  }, [user, handlePaymentReturnMutation, refreshSubscription, showSuccess, i18n]);


  // Close Payment Method Selection Modal
  const closePaymentMethodSelection = useCallback(() => {
    setShowPaymentMethodSelection(false);
    setPendingPlanId(null);
  }, []);

  // Combined Loading State
  const isLoading = isLoadingPlans || isLoadingSub;

  return useMemo(() => ({
    // Data
    plans,
    userSubscription,
    selectedPlanId: selectedPlanId || userSubscription?.planId,
    
    // States
    isLoading,
    isUpdating: purchaseMutation.isPending,
    isCancelling: cancelMutation.isPending,
    showPaymentMethodSelection,
    pendingPlanId,

    // Actions
    handlePlanSelect,
    handlePlanUpdate,
    handlePaymentMethodSelect,
    handleCancelSubscription,
    refreshSubscription,
    handlePaymentReturn,
    closePaymentMethodSelection
  }), [
    plans,
    userSubscription,
    selectedPlanId,
    isLoading,
    purchaseMutation.isPending,
    cancelMutation.isPending,
    showPaymentMethodSelection,
    pendingPlanId,
    handlePlanSelect,
    handlePlanUpdate,
    handlePaymentMethodSelect,
    handleCancelSubscription,
    refreshSubscription,
    handlePaymentReturn,
    closePaymentMethodSelection
  ]);
};
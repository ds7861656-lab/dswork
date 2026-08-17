import { HttpClient } from './httpClient';
import type { VipOrder } from '../../types/api';

/**
 * New unified Payment Service for the refactored backend
 * Uses single endpoint: /api/v1/payments/*
 */
export class PaymentService extends HttpClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Unified payment initiation for both Alipay and Stripe
   * Replaces: /alipay/api/initiate-payment, /api/v1/vip/orders/*
   */
  async initiatePayment(vipType: 'VIP_WEEK' | 'VIP_MONTH' | 'VIP_QUARTER' | 'VIP_YEAR', paymentMethod: 'ALIPAY' | 'STRIPE'): Promise<{
    success: boolean;
    orderNo: string;
    paymentMethod: 'ALIPAY' | 'STRIPE';
    paymentHtml?: string;
    clientSecret?: string;
    errorMessage?: string;
    errorCode?: string;
  }> {
    try {
      const response = await this.post<{
        success: boolean;
        orderNo: string;
        paymentMethod: 'ALIPAY' | 'STRIPE';
        paymentHtml?: string;
        clientSecret?: string;
        errorMessage?: string;
        errorCode?: string;
      }>('/api/v1/payments/initiate', {
        vipType,
        paymentMethod
      });

      return response;
    } catch (error) {
      return {
        success: false,
        orderNo: '',
        paymentMethod: paymentMethod,
        errorMessage: error instanceof Error ? error.message : 'Payment initiation failed',
        errorCode: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Check payment status for an order
   * Replaces: /alipay/api/check-payment-status
   */
  async checkPaymentStatus(orderNo: string): Promise<{
    success: boolean;
    isPaid: boolean;
    status: string;
    orderNo: string;
    message?: string;
  }> {
    try {
      const response = await this.get<{
        success: boolean;
        isPaid: boolean;
        status: string;
        orderNo: string;
        message?: string;
      }>(`/api/v1/payments/status/${orderNo}`);

      return response;
    } catch (error) {
      return {
        success: false,
        isPaid: false,
        status: 'unknown',
        orderNo,
        message: error instanceof Error ? error.message : 'Failed to check payment status'
      };
    }
  }

  /**
   * Get current subscription information
   * Replaces: subscriptionService.getUserSubscription logic
   */
  async getSubscription(): Promise<{
    success: boolean;
    status?: 'active' | 'expired';
    planId?: string;
    vipTypeId?: string;
    expiresAt?: string;
    autoRenew?: boolean;
    message?: string;
  }> {
    try {
      const response = await this.get<{
        success: boolean;
        status?: 'active' | 'expired';
        planId?: string;
        vipTypeId?: string;
        expiresAt?: string;
        autoRenew?: boolean;
        message?: string;
      }>('/api/v1/payments/subscription');

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get subscription info'
      };
    }
  }

  /**
   * Activate free trial
   * Replaces: existing trial activation logic
   */
  async activateFreeTrial(): Promise<{
    success: boolean;
    message?: string;
    errorMessage?: string;
  }> {
    try {
      const response = await this.post<{
        success: boolean;
        message?: string;
        errorMessage?: string;
      }>('/api/v1/payments/trial');

      return response;
    } catch (error) {
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to activate free trial'
      };
    }
  }

  /**
   * Get order history
   * Replaces: /api/v1/vip/orders
   */
  async getOrders(currentPage: number = 1, pageSize: number = 10): Promise<{
    success: boolean;
    data?: {
      records: VipOrder[];
      total: number;
      size: number;
      current: number;
      pages: number;
    };
    message?: string;
  }> {
    try {
      const response = await this.get<{
        success: boolean;
        data: {
          records: VipOrder[];
          total: number;
          size: number;
          current: number;
          pages: number;
        };
        message?: string;
      }>(`/api/v1/payments/orders?current=${currentPage}&size=${pageSize}`);

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get order history'
      };
    }
  }

  /**
   * Delete/cancel an unpaid order
   * Replaces: /api/v1/vip/orders/{orderNo}
   */
  async deleteOrder(orderNo: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await this.delete<{
        success: boolean;
        message?: string;
      }>(`/api/v1/payments/orders/${orderNo}`);

      return response;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete order'
      };
    }
  }

  /**
   * Helper method to map frontend plan IDs to backend VIP types
   */
  mapPlanIdToVipType(planId: string): 'VIP_WEEK' | 'VIP_MONTH' | 'VIP_QUARTER' | 'VIP_YEAR' {
    const mapping: Record<string, 'VIP_WEEK' | 'VIP_MONTH' | 'VIP_QUARTER' | 'VIP_YEAR'> = {
      'week': 'VIP_WEEK',
      'month': 'VIP_MONTH', 
      'quarter': 'VIP_QUARTER',
      'year': 'VIP_YEAR'
    };
    return mapping[planId] || 'VIP_MONTH';
  }

  /**
   * Helper method to map frontend payment methods to backend format
   */
  mapPaymentMethodToBackend(paymentMethod: 'alipay' | 'stripe'): 'ALIPAY' | 'STRIPE' {
    return paymentMethod === 'alipay' ? 'ALIPAY' : 'STRIPE';
  }
}
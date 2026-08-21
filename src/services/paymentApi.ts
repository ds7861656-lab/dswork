// src/services/paymentApi.ts
// Payment API Service - Fixed for actual backend response structure

import type { ActivityBookingFormData } from '../types/activity';

const API_BASE_URL = 'https://afreshtrip.cn/web';

const VIP_TYPE_CODE_MAPPING: Record<string, string> = {
  'week': 'VIP_WEEK',
  'month': 'VIP_MONTH',
  'season': 'VIP_QUARTER',
  'year': 'VIP_YEAR'
};

const VIP_TYPE_ID_MAPPING: Record<string, number> = {
  'week': 1,
  'month': 2,
  'season': 3,
  'year': 4
};

const PLAN_PRICING: Record<string, number> = {
  'week': 19,
  'month': 39,
  'season': 89,
  'year': 199
};

// ============================================================================
// AUTH TOKEN
// ============================================================================

const getAuthToken = (): string => {
  const token = localStorage.getItem('token') ||
                localStorage.getItem('authToken') ||
                localStorage.getItem('custom_auth_token') ||
                sessionStorage.getItem('token');
  
  if (!token) {
    throw new Error('未登录，请先登录 / Not logged in. Please login first.');
  }

  console.log('✅ Using authentication token');
  console.log('Token source:', localStorage.getItem('token') ? 'token' : 
                               localStorage.getItem('custom_auth_token') ? 'custom_auth_token' : 
                               'other');
  console.log('Token (first 30 chars):', token.substring(0, 30) + '...');
  
  return token;
};

const getUserId = (): number | null => {
  const userDataStr = localStorage.getItem('userData') || 
                      localStorage.getItem('user') ||
                      localStorage.getItem('custom_user_data') ||
                      sessionStorage.getItem('userData');
  
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      if (userData.userId) {
        return userData.userId;
      }
    } catch (e) {
      console.warn('Failed to parse user data:', e);
    }
  }

  const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
  if (userId) {
    return parseInt(userId);
  }

  return null;
};

// ============================================================================
// TYPES
// ============================================================================

interface CreateOrderRequest {
  levelId: number;
}

interface OrderData {
  id: number;
  userId: number;
  vipTypeId: number;
  orderNo: string;
  amount: number;
  status: number;
  payType: number;
  startTime: string;
  endTime: string;
  createAt: string | null;
  updateAt: string | null;
  payQrCode: string;
}

interface CreateOrderResponse {
  msg: string;
  code: number;
  data: OrderData;
}

// ✅ UPDATED: Handle actual backend response
interface CheckOrderStatusResponse {
  msg: string;
  code: number;
  data: {
    status?: number;      // Might have status
    payType?: number;     // Or might have payType
    orderNo: string;
  };
}

// ============================================================================
// CREATE ORDER
// ============================================================================

export const createAlipayOrder = async (planId: string): Promise<OrderData> => {
  let token: string;
  try {
    token = getAuthToken();
  } catch (error: any) {
    throw new Error(error.message || 'Authentication failed. Please login.');
  }
  
  const levelId = VIP_TYPE_ID_MAPPING[planId] || 2;

  console.log('🛒 Creating Alipay order...');
  console.log('Plan ID:', planId);
  console.log('Level ID:', levelId);
  console.log('API URL:', `${API_BASE_URL}/order/createOrder`);

  try {
    const response = await fetch(`${API_BASE_URL}/order/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        levelId: levelId
      } as CreateOrderRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      throw new Error(errorData.msg || `Failed to create order (${response.status})`);
    }

    const result: CreateOrderResponse = await response.json();
    console.log('Backend response:', result);

    if (result.code !== 200) {
      throw new Error(result.msg || 'Order creation failed');
    }

    console.log('✅ Order created successfully!');
    console.log('Order Number:', result.data.orderNo);
    console.log('QR Code URL:', result.data.payQrCode);

    return result.data;

  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      throw new Error('网络错误，请检查网络连接 / Network error. Please check your connection.');
    }
    
    if (error.message.includes('401') || error.message.includes('403')) {
      throw new Error('认证失败，请重新登录 / Authentication failed. Please login again.');
    }

    throw error;
  }
};

// ============================================================================
// CREATE ACTIVITY ORDER (活动预订 → 支付宝下单)
// ============================================================================

export interface ActivityOrderData {
  orderNo: string;
  amount: number;
  payQrCode: string;
  status?: number;
  payType?: number;
  [key: string]: unknown;
}

export const createActivityOrder = async (
  activityId: string,
  formData: ActivityBookingFormData,
  amount: number
): Promise<ActivityOrderData> => {
  let token: string;
  try {
    token = getAuthToken();
  } catch (error: any) {
    throw new Error(error.message || 'Authentication failed. Please login.');
  }

  console.log('🛒 Creating activity Alipay order...');
  console.log('Activity ID:', activityId);
  console.log('API URL:', `${API_BASE_URL}/activity/booking`);

  try {
    const response = await fetch(`${API_BASE_URL}/activity/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        activityId,
        ...formData,
        amount,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      throw new Error(errorData.msg || `Failed to create activity order (${response.status})`);
    }

    const result: { msg: string; code: number; data: ActivityOrderData } = await response.json();
    console.log('Backend response:', result);

    if (result.code !== 200) {
      throw new Error(result.msg || 'Activity order creation failed');
    }

    console.log('✅ Activity order created successfully!');
    console.log('Order Number:', result.data.orderNo);
    console.log('QR Code URL:', result.data.payQrCode);

    return result.data;
  } catch (error: any) {
    console.error('❌ Error creating activity order:', error);

    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
      throw new Error('网络错误，请检查网络连接 / Network error. Please check your connection.');
    }

    if (error.message.includes('401') || error.message.includes('403')) {
      throw new Error('认证失败，请重新登录 / Authentication failed. Please login again.');
    }

    throw error;
  }
};

// ============================================================================
// CHECK ORDER STATUS - FIXED FOR ACTUAL BACKEND
// ============================================================================

export const checkOrderStatus = async (orderNo: string): Promise<number> => {
  let token: string;
  try {
    token = getAuthToken();
  } catch (error: any) {
    throw new Error(error.message || 'Authentication failed');
  }

  try {
    console.log('🔍 Checking order status...');
    console.log('Order No:', orderNo);
    
    const response = await fetch(`${API_BASE_URL}/order/checkStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderNo })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || 'Failed to check order status');
    }

    const result: CheckOrderStatusResponse = await response.json();
    
    // ✅ LOG THE FULL RESPONSE
    console.log('📡 FULL Backend Response:', result);
    console.log('📦 Response code:', result.code);
    console.log('📦 Response msg:', result.msg);
    console.log('📦 Response data:', result.data);

    if (result.code !== 200) {
      throw new Error(result.msg || 'Status check failed');
    }

    // ✅ HANDLE DIFFERENT RESPONSE STRUCTURES
    let statusValue: number;

    if (result.data.status !== undefined) {
      // Structure 1: Has "status" field
      console.log('✅ Found status field:', result.data.status);
      statusValue = result.data.status;
    } else if (result.data.payType !== undefined) {
      // Structure 2: Has "payType" field
      console.log('⚠️ No status field, found payType:', result.data.payType);
      
      // Check if message indicates success
      if (result.msg === '支付成功' || result.msg.includes('成功')) {
        console.log('✅ Message indicates success! Treating as PAID');
        statusValue = 1; // PAID
      } else {
        console.log('⏳ No success indicator, treating as PENDING');
        statusValue = 0; // PENDING
      }
    } else {
      // Structure 3: Neither field exists
      console.error('❌ Response has neither status nor payType!');
      console.error('Full data object:', JSON.stringify(result.data, null, 2));
      
      // Check message as fallback
      if (result.msg === '支付成功' || result.msg.includes('成功')) {
        console.log('✅ Using message as indicator: PAID');
        statusValue = 1;
      } else {
        console.log('⏳ Assuming PENDING');
        statusValue = 0;
      }
    }

    console.log('🎯 Final status value:', statusValue);
    console.log('🎯 Status meaning:', 
      statusValue === 0 ? '⏳ PENDING' : 
      statusValue === 1 ? '✅ PAID' : 
      statusValue === 2 ? '❌ CANCELLED' : 
      '❓ UNKNOWN'
    );

    return statusValue;

  } catch (error: any) {
    console.error('❌ Error checking order status:', error);
    throw error;
  }
};

// ============================================================================
// POLL ORDER STATUS
// ============================================================================

export const pollOrderStatus = async (
  orderNo: string,
  maxAttempts: number = 60,
  intervalMs: number = 3000
): Promise<boolean> => {
  console.log('🔄 Starting payment status polling...');
  console.log('Order No:', orderNo);
  console.log('Max Attempts:', maxAttempts);
  console.log('Interval:', intervalMs, 'ms');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const status = await checkOrderStatus(orderNo);

      console.log(`📊 Attempt ${attempt}/${maxAttempts} - Status:`, status);

      if (status === 1) {
        console.log('✅ Payment confirmed!');
        return true;
      }

      if (status === 2) {
        console.log('❌ Payment cancelled');
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs));

    } catch (error) {
      console.error(`⚠️ Polling error on attempt ${attempt}:`, error);
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  console.log('⏱️ Polling timeout');
  return false;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getPlanDetails = (planId: string): { 
  name: string; 
  price: number; 
  vipTypeId: number;
  vipTypeCode: string;
} => {
  const plans: Record<string, { name: string; price: number; vipTypeId: number; vipTypeCode: string }> = {
    'week': { 
      name: 'Week', 
      price: PLAN_PRICING.week,
      vipTypeId: 1,
      vipTypeCode: 'WEEK'
    },
    'month': { 
      name: 'Month', 
      price: PLAN_PRICING.month,
      vipTypeId: 2,
      vipTypeCode: 'MONTH'
    },
    'season': { 
      name: 'Season', 
      price: PLAN_PRICING.season,
      vipTypeId: 3,
      vipTypeCode: 'SEASON'
    },
    'year': { 
      name: 'Year', 
      price: PLAN_PRICING.year,
      vipTypeId: 4,
      vipTypeCode: 'YEAR'
    }
  };

  return plans[planId] || plans['month'];
};

export const isValidPlanId = (planId: string): boolean => {
  return ['week', 'month', 'season', 'year'].includes(planId);
};

export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') ||
                localStorage.getItem('custom_auth_token') ||
                sessionStorage.getItem('token');
  return !!token;
};

export {
  VIP_TYPE_CODE_MAPPING,
  VIP_TYPE_ID_MAPPING,
  PLAN_PRICING
};

export type {
  OrderData,
  CreateOrderResponse,
  CheckOrderStatusResponse
};
// src/utils/chineseLoginStorage.ts
// Utility for storing and retrieving Chinese login data

/**
 * Chinese Login Response Interface
 */
export interface ChineseLoginResponse {
  token: string;
  userId: number;
  phone: string;
  nickname: string;
  payType: number; // ✅ NEW: 0=Free, 1=Week, 2=Month, 3=Quarter, 4=Year
  msg?: string;
}

/**
 * Subscription Plan Type
 */
export const PayType = {
  FREE: 0,
  VIP_WEEK: 1,
  VIP_MONTH: 2,
  VIP_QUARTER: 3,
  VIP_YEAR: 4
} as const;

export type PayType = typeof PayType[keyof typeof PayType];

/**
 * Get subscription plan name from payType
 */
export const getSubscriptionPlanName = (payType: number): string => {
  switch (payType) {
    case PayType.FREE:
      return 'Free';
    case PayType.VIP_WEEK:
      return 'VIP Week';
    case PayType.VIP_MONTH:
      return 'VIP Month';
    case PayType.VIP_QUARTER:
      return 'VIP Quarter';
    case PayType.VIP_YEAR:
      return 'VIP Year';
    default:
      return 'Free';
  }
};

/**
 * Get subscription plan ID from payType
 */
export const getSubscriptionPlanId = (payType: number): string => {
  switch (payType) {
    case PayType.VIP_WEEK:
      return 'week';
    case PayType.VIP_MONTH:
      return 'month';
    case PayType.VIP_QUARTER:
      return 'season';
    case PayType.VIP_YEAR:
      return 'year';
    default:
      return 'free';
  }
};

/**
 * Check if user has premium subscription
 */
export const hasPremiumSubscription = (payType: number): boolean => {
  return payType > PayType.FREE;
};

/**
 * Save Chinese login data to localStorage
 * Call this immediately after successful login
 * 
 * @param loginData - Response from Chinese login API
 * 
 * @example
 * const response = await fetch('/api/auth/login', {...});
 * const data = await response.json();
 * saveChineseLoginData(data);
 */
export const saveChineseLoginData = (loginData: ChineseLoginResponse): void => {
  console.log('💾 Saving Chinese login data to localStorage...');
  
  try {
    // 1. Save token (used by payment API)
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('authToken', loginData.token);
    
    // 2. Save user data (including payType)
    const userData = {
      userId: loginData.userId,
      phone: loginData.phone,
      nickname: loginData.nickname || loginData.phone,
      payType: loginData.payType || 0 // ✅ NEW: Store payType
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userId', String(loginData.userId));
    localStorage.setItem('payType', String(loginData.payType || 0)); // ✅ NEW: Store separately
    
    // 3. Also save to sessionStorage as backup
    sessionStorage.setItem('token', loginData.token);
    sessionStorage.setItem('userData', JSON.stringify(userData));
    sessionStorage.setItem('payType', String(loginData.payType || 0));
    
    console.log('✅ Chinese login data saved successfully!');
    console.log('Token (first 30 chars):', loginData.token.substring(0, 30) + '...');
    console.log('User ID:', loginData.userId);
    console.log('Phone:', loginData.phone);
    console.log('PayType:', loginData.payType, '(' + getSubscriptionPlanName(loginData.payType) + ')');
    
  } catch (error) {
    console.error('❌ Failed to save login data:', error);
    throw new Error('Failed to save login data');
  }
};

/**
 * Get Chinese login token from storage
 * 
 * @returns Token string or null if not logged in
 */
export const getChineseLoginToken = (): string | null => {
  return localStorage.getItem('token') || 
         localStorage.getItem('authToken') ||
         sessionStorage.getItem('token');
};

/**
 * Get Chinese login user data from storage
 * 
 * @returns User data or null if not logged in
 */
export const getChineseLoginUserData = (): {
  userId: number;
  phone: string;
  nickname: string;
  payType: number; // ✅ NEW
} | null => {
  const userDataStr = localStorage.getItem('userData') || 
                      sessionStorage.getItem('userData');
  
  if (!userDataStr) return null;
  
  try {
    return JSON.parse(userDataStr);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

/**
 * Get user's payType (subscription status)
 * 
 * @returns PayType number (0-4) or null if not logged in
 */
export const getUserPayType = (): number | null => {
  // Try to get from localStorage first
  const payTypeStr = localStorage.getItem('payType') || sessionStorage.getItem('payType');
  if (payTypeStr) {
    return parseInt(payTypeStr, 10);
  }
  
  // Fallback to userData object
  const userData = getChineseLoginUserData();
  return userData?.payType ?? null;
};

/**
 * Update user's payType (after subscription change)
 * 
 * @param payType - New payType value
 */
export const updateUserPayType = (payType: number): void => {
  console.log('📝 Updating payType to:', payType, '(' + getSubscriptionPlanName(payType) + ')');
  
  // Update standalone payType
  localStorage.setItem('payType', String(payType));
  sessionStorage.setItem('payType', String(payType));
  
  // Update in userData object
  const userData = getChineseLoginUserData();
  if (userData) {
    userData.payType = payType;
    localStorage.setItem('userData', JSON.stringify(userData));
    sessionStorage.setItem('userData', JSON.stringify(userData));
  }
  
  console.log('✅ PayType updated successfully');
};

/**
 * Check if user is logged in with Chinese login
 * 
 * @returns true if logged in, false otherwise
 */
export const isChineseLoginAuthenticated = (): boolean => {
  const token = getChineseLoginToken();
  const userData = getChineseLoginUserData();
  
  return !!(token && userData && userData.userId);
};

/**
 * Clear all Chinese login data (logout)
 */
export const clearChineseLoginData = (): void => {
  console.log('🗑️ Clearing Chinese login data...');
  
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
  localStorage.removeItem('payType'); // ✅ NEW
  
  // Clear sessionStorage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userData');
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('payType'); // ✅ NEW
  
  console.log('✅ Chinese login data cleared');
};

/**
 * Get token expiry date
 * 
 * @returns Date object or null if token invalid
 */
export const getTokenExpiry = (): Date | null => {
  const token = getChineseLoginToken();
  if (!token) return null;
  
  try {
    // JWT token format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode payload (base64)
    const payload = JSON.parse(atob(parts[1]));
    
    // exp is in seconds, convert to milliseconds
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * 
 * @returns true if expired, false if still valid
 */
export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return true;
  
  return expiry < new Date();
};

/**
 * Get user info summary for display
 * 
 * @returns User info string or null
 */
export const getUserInfoSummary = (): string | null => {
  const userData = getChineseLoginUserData();
  if (!userData) return null;
  
  const planName = getSubscriptionPlanName(userData.payType);
  return `${userData.nickname} (${userData.phone}) - ${planName}`;
};

/**
 * Validate login response before saving
 * 
 * @param data - Response from login API
 * @returns true if valid, false otherwise
 */
export const validateLoginResponse = (data: any): data is ChineseLoginResponse => {
  return !!(
    data &&
    typeof data.token === 'string' &&
    typeof data.userId === 'number' &&
    typeof data.phone === 'string' &&
    data.token.length > 0 &&
    data.userId > 0 &&
    typeof data.payType === 'number' // ✅ NEW: Validate payType
  );
};
/**
 * SMS Verification API Service
 * Handles all SMS-related API calls for Chinese phone authentication
 */

export interface SendCodeResponse {
  msg: string | null;
  code: number;
  data: string;
}

export interface VerifyCodeResponse {
  msg: string;
  code: number;
  data?: any;
}

export interface ApiError {
  message: string;
  code?: number;
}

// Base API URL - adjust this to match your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Send SMS verification code to phone number
 */
export const sendVerificationCode = async (phone: string): Promise<SendCodeResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sms/send-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SendCodeResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw {
      message: '发送验证码失败，请检查网络连接',
      code: 500,
    } as ApiError;
  }
};

/**
 * Verify SMS code
 */
export const verifyCode = async (
  phone: string, 
  code: string
): Promise<VerifyCodeResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sms/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: VerifyCodeResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw {
      message: '验证失败，请重试',
      code: 500,
    } as ApiError;
  }
};

/**
 * Validate Chinese phone number format
 */
export const isValidChinesePhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone);
};

/**
 * Format phone number for display (e.g., 138****8888)
 */
export const formatPhoneDisplay = (phone: string): string => {
  if (phone.length !== 11) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(7)}`;
};

/**
 * Validate verification code format
 */
export const isValidVerificationCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};

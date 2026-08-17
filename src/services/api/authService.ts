// src/services/api/authService.ts

import { HttpClient } from './httpClient';

/**
 * Authentication service for handling auth-related endpoints
 */
export class AuthService extends HttpClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Check authentication service health
   */
  async getAuthHealth(): Promise<string> {
    const response = await this.get<string>('/auth/health', { requiresAuth: false });
    return response;
  }

  /**
   * Get detailed auth status
   */
  async getAuthStatus(): Promise<{
    firebaseEnabled: boolean;
    status: string;
    description: string;
  }> {
    return this.get('/auth/status', { requiresAuth: false });
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await this.get<{
        code: number;
        message: string;
        data: boolean;
        timestamp?: number;
      }>('/auth/check');
      return response.data;
    } catch {
      return false;
    }
  }

  // ============================================================================
  // SMS AUTHENTICATION
  // ============================================================================

  /**
   * Send SMS verification code
   */
  async sendSmsCode(phone: string): Promise<{
    code: number;
    message: string;
    data: null;
    timestamp?: number;
  }> {
    return this.post('/api/v1/sms/send-code', { phone }, { requiresAuth: false });
  }

  /**
   * Verify SMS code and login
   */
  async verifySmsCode(phone: string, code: string): Promise<{
    code: number;
    message: string;
    data: {
      token: string;
      userId: number;
      nickname: string;
      phone: string;
    };
    timestamp?: number;
  }> {
    return this.post('/api/v1/sms/verify-code', { phone, code }, { requiresAuth: false });
  }

  // ============================================================================
  // EMAIL AUTHENTICATION
  // ============================================================================

  /**
   * Send email verification code
   */
  async sendEmailCode(email: string): Promise<{
    code: number;
    message: string;
    data: null;
    timestamp?: number;
  }> {
    return this.post('/api/v1/email/send-code', { email }, { requiresAuth: false });
  }

  /**
   * Verify email code and login
   */
  async verifyEmailCode(email: string, code: string): Promise<{
    code: number;
    message: string;
    data: {
      token: string;
      userId: number;
      nickname: string;
      email: string;
    };
    timestamp?: number;
  }> {
    return this.post('/api/v1/email/verify-code', { email, code }, { requiresAuth: false });
  }
}
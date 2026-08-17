// src/services/api/httpClient.ts

import { auth } from '../../../lib/firebase/client';
import i18n from '../../i18n';
import {
  AuthenticationError,
  NetworkError,
  TimeoutError,
  isApiError,
  createErrorFromResponse,
  createErrorFromApiResponse,
  SubscriptionRequiredError
} from './errors';

/**
 * Request configuration interface
 */
export interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
  timeout?: number;
}

/**
 * Base HTTP Client for API communication
 */
export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authentication token for requests
   * Prioritizes custom auth token over Firebase token
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      // Check for custom auth token first (for Chinese users)
      const customToken = localStorage.getItem('custom_auth_token');
      if (customToken) {
        console.log('Using custom auth token for request (length:', customToken.length, ')');
        console.log('Custom token starts with:', customToken.substring(0, 20) + '...');
        console.log('Custom user data present:', !!localStorage.getItem('custom_user_data'));
        return `Bearer ${customToken}`;
      }

      // Fallback to Firebase token
      const user = auth.currentUser;
      if (!user) {
        console.log('No auth token available - no custom token and no Firebase user');
        return null;
      }
      const token = await user.getIdToken();
      console.log('Using Firebase auth token for request (length:', token.length, ')');
      return `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  /**
   * Make HTTP request with automatic auth token handling
   */
  protected async request<T = unknown>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      requiresAuth = true,
      timeout = 30000,
      headers = {},
      ...restConfig
    } = config;

    // Add language parameter to URL if not already present
    const url = new URL(endpoint, this.baseUrl);
    if (!url.searchParams.has('lang')) {
      url.searchParams.set('lang', i18n.language || 'en');
    }
    const fullEndpoint = `${url.pathname}${url.search}`;

    // Build headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // If sending FormData, delete Content-Type.
    // The browser will automatically set 'multipart/form-data; boundary=...'
    if (restConfig.body instanceof FormData) {
      delete requestHeaders['Content-Type'];
    }

    // Merge additional headers
    if (headers) {
      Object.assign(requestHeaders, headers);
    }

    // Add auth token if required
    if (requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = token;
      } else if (requiresAuth) {
        throw new AuthenticationError();
      }
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log(`Making API request to: ${this.baseUrl}${fullEndpoint}`);
      console.log('Request headers:', requestHeaders);
      console.log('Request method:', restConfig.method || 'GET');
      const response = await fetch(`${this.baseUrl}${fullEndpoint}`, {
        ...restConfig,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Log authentication errors for debugging
        if (response.status === 401 || response.status === 403) {
          console.error(`Authentication failed for ${endpoint}:`, {
            status: response.status,
            statusText: response.statusText,
            errorData,
            timestamp: new Date().toISOString(),
            endpoint,
            hasAuthHeader: requestHeaders['Authorization'] ? 'yes' : 'no',
            authType: localStorage.getItem('custom_auth_token') ? 'custom' : 'firebase'
          });
        }

         // Intercept Subscription Check
        if (response.status === 403 && errorData.message === 'SUBSCRIPTION_REQUIRED') {
          throw new SubscriptionRequiredError();
        }

        // Handle authentication errors - clear invalid tokens only for 401 (Unauthorized)
        // 403 (Forbidden) may be permission-related, not token invalidation
        if (response.status === 401) {
          console.warn('Authentication token invalid, clearing tokens');
          localStorage.removeItem('custom_auth_token');
          localStorage.removeItem('custom_user_data');
        }

        throw createErrorFromResponse(response, errorData);
      }

      const data = await response.json();

      // Handle API-level errors (non-200 codes)
      if (data.code && data.code !== 200) {
        // Double check for subscription error in successful HTTP response (if backend wraps 403 in 200)
        if (data.code === 403 && data.message === 'SUBSCRIPTION_REQUIRED') {
           throw new SubscriptionRequiredError();
        }
        throw createErrorFromApiResponse(data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (isApiError(error)) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError();
        }
        throw new NetworkError(error.message);
      }

      throw new NetworkError('Unknown error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    config: Omit<RequestConfig, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}
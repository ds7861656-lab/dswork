// src/services/api/newsletterService.ts

import { HttpClient } from './httpClient';

/**
 * Newsletter service for handling email subscriptions
 */
export class NewsletterService extends HttpClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Subscribe to newsletter
   * @param email - Email address to subscribe
   * @returns Promise<boolean> - Success status
   */
  async subscribe(email: string): Promise<boolean> {
    try {
      const response = await this.post<{
        code: number;
        message: string;
        data: boolean;
        timestamp?: number;
      }>('/api/v1/newsletter/subscribe', { email });
      return response.data;
    } catch (err) {
      console.error('Newsletter subscription failed:', err);
      throw err;
    }
  }

  /**
   * Unsubscribe from newsletter
   * @param email - Email address to unsubscribe
   * @returns Promise<boolean> - Success status
   */
  async unsubscribe(email: string): Promise<boolean> {
    try {
      const response = await this.post<{
        code: number;
        message: string;
        data: boolean;
        timestamp?: number;
      }>('/api/v1/newsletter/unsubscribe', { email });
      return response.data;
    } catch (err) {
      console.error('Newsletter unsubscribe failed:', err);
      throw err;
    }
  }
}
import { HttpClient } from './httpClient';
import type { ResultString, ResultMediaPageVo } from '../../types/api';

/**
 * Storage service for handling file uploads and media library
 */
export class StorageService extends HttpClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Upload a single file to storage
   * Endpoint: POST /api/v1/storage/upload
   */
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.request<ResultString>('/api/v1/storage/upload', {
      method: 'POST',
      body: formData as unknown as BodyInit,
      // We don't set Content-Type header here; 
      // the browser will automatically set it with the correct boundary for FormData
    });

    return response.data;
  }

  /**
   * Get user's media library history with pagination
   * Endpoint: GET /api/v1/storage/my-images?page={page}&size={size}
   */
  async getUserMedia(page: number = 1, size: number = 20): Promise<{
    images: string[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await this.get<ResultMediaPageVo>(
      `/api/v1/storage/my-images?page=${page}&size=${size}`
    );

    return {
      images: response.data.records,
      total: response.data.total,
      hasMore: response.data.current < response.data.pages
    };
  }
}
// src/services/api/activityService.ts

import { HttpClient } from './httpClient';
import type { ActivityBookingFormData } from '../../types/activity';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://afreshtrip.cn/web';

// 后端下单接口返回的数据（按实际后端字段补充）
export interface BookingResult {
  orderNo?: string;
  [key: string]: unknown;
}

export class ActivityService extends HttpClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * 提交活动预订订单
   * @param activityId 活动 id
   * @param formData 表单数据（人数、日期、联系人等）
   */
  async submitBooking(
    activityId: string,
    formData: ActivityBookingFormData
  ): Promise<BookingResult> {
    return this.post<BookingResult>('/activity/booking', {
      activityId,
      ...formData
    });
  }
}

export const activityService = new ActivityService(API_BASE_URL);

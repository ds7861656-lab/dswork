// src/services/api/activityService.ts

import { HttpClient } from './httpClient';
import type { Activity, ActivityBookingFormData } from '../../types/activity';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://afreshtrip.cn/web';

// 后端下单接口返回的数据（按实际后端字段补充）
export interface BookingResult {
  orderNo?: string;
  [key: string]: unknown;
}

// 后端返回的活动原始结构（price/goproPrice 为数字，其余与前端 Activity 对齐）
export interface ActivityVo {
  id: string | number;
  title: string;
  rating: string;
  reviews: number;
  price: number | string;
  unit: string;
  unitCount?: number;
  image: string;
  detailMode: 'standard' | 'package';
  bookingType: 'singleDate' | 'dateRange';
  duration?: string;
  ageRange?: string;
  guideLanguages?: string[];
  capacityNote?: string;
  highlights?: string[];
  equipmentNotes?: string[];
  packageSubtitle?: string;
  packageItems?: string[];
  hasGoPro?: boolean;
  goproPrice?: number | string;
  goproUnit?: string;
  goproLabelKey?: string;
}

// 后端返回结构 → 前端 Activity 类型
function mapActivityVoToActivity(vo: ActivityVo): Activity {
  return {
    id: String(vo.id),
    title: vo.title,
    rating: vo.rating,
    reviews: vo.reviews,
    price: typeof vo.price === 'number' ? `${vo.price}rmb` : vo.price,
    unit: vo.unit,
    unitCount: vo.unitCount,
    image: vo.image,
    detailMode: vo.detailMode,
    bookingType: vo.bookingType,
    duration: vo.duration,
    ageRange: vo.ageRange,
    guideLanguages: vo.guideLanguages,
    capacityNote: vo.capacityNote,
    highlights: vo.highlights,
    equipmentNotes: vo.equipmentNotes,
    packageSubtitle: vo.packageSubtitle,
    packageItems: vo.packageItems,
    hasGoPro: vo.hasGoPro,
    goproPrice:
      vo.goproPrice != null
        ? typeof vo.goproPrice === 'number'
          ? `${vo.goproPrice}rmb`
          : vo.goproPrice
        : undefined,
    goproUnit: vo.goproUnit,
    goproLabelKey: vo.goproLabelKey
  };
}

export class ActivityService extends HttpClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * 活动列表
   * GET /activity/list
   */
  async getActivities(): Promise<Activity[]> {
    const res: any = await this.get('/activity/list');
    const list = Array.isArray(res) ? res : (res?.data ?? []);
    return list.map(mapActivityVoToActivity);
  }

  /**
   * 活动详情
   * GET /activity/{id}
   */
  async getActivityById(id: string): Promise<Activity | null> {
    const res: any = await this.get(`/activity/${id}`);
    const vo = res?.data ?? res;
    if (!vo || typeof vo !== 'object') return null;
    return mapActivityVoToActivity(vo as ActivityVo);
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

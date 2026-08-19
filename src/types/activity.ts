export interface GalleryItem {
  id: string;
  imageUrl: string;
}

export type ActivityDetailMode = 'standard' | 'package';
export type ActivityBookingType = 'singleDate' | 'dateRange';

export interface ActivityHighlight {
  iconKey: 'capacity' | 'duration' | 'age';
  labelKey: string;
  value: string;
}

export interface ActivityBookingFormData {
  bookingType: ActivityBookingType;

  placeCount: number;
  goproCount: number;

  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;

  // singleDate 模式：singleDateObj 有值
  singleDateText?: string;
  singleDateObjISO?: string;

  // dateRange 模式：start/end 有值
  startDateText?: string;
  startDateObjISO?: string;
  endDateText?: string;
  endDateObjISO?: string;
}

export interface Activity {
  id: string;
  title: string;
  rating: string;
  reviews: number;
  price: string;
  unit: string;
  unitCount?: number;
  details?: string;
  isSpecial?: boolean;
  image: string;

  // ✅ 显式详情模式（后端直接告诉前端用哪种布局渲染）
  detailMode: ActivityDetailMode;

  // ✅ 显式预订表单模式（后端直接告诉前端是单日选择，还是 Start/End 双日期 + 时间）
  bookingType: ActivityBookingType;

  // 详情页字段 - standard 模式使用
  capacityNote?: string;
  duration?: string;
  ageRange?: string;
  guideLanguages?: string[];
  highlights?: string[];
  equipmentNotes?: string[];

  // 详情页字段 - package 模式使用
  packageSubtitle?: string;
  packageItems?: string[];

  // GoPro 附加服务
  hasGoPro?: boolean;
  goproPrice?: string;
  goproUnit?: string;
  goproLabelKey?: string;
}

// 把字符串如 "800rmb" / "¥800" / "800" 解析成数字 800
export function parsePriceToNumber(price?: string): number {
  if (!price) return 0;
  const digits = price.replace(/[^0-9.]/g, '');
  if (!digits) return 0;
  const n = parseFloat(digits);
  return Number.isFinite(n) ? n : 0;
}

// 把数字格式化成价格（800 → 800rmb）
export function formatPriceToRMB(n: number): string {
  const rounded = Math.round(n);
  return `${rounded}rmb`;
}

// 计算总金额：
// - unit === 'boat' / 'car' 这种包船/包车：按 1 份 activity.price × 1
// - unit === 'person'：按 activity.price × placeCount
// - 再加 hasGoPro ? goproPrice × goproCount : 0
export function calculateActivityTotal(
  activity: Activity,
  placeCount: number,
  goproCount: number
): {
  baseAmount: number;
  goproAmount: number;
  totalAmount: number;
  baseRMB: string;
  goproRMB: string;
  totalRMB: string;
} {
  const unit = activity.unit ?? 'person';
  const basePrice = parsePriceToNumber(activity.price);
  let baseAmount: number;
  if (unit === 'person') {
    baseAmount = basePrice * Math.max(1, placeCount);
  } else {
    // boat / car... 包船/包场，单价不随人数乘
    baseAmount = basePrice;
  }

  const goproPrice = parsePriceToNumber(activity.goproPrice);
  const goproAmount = activity.hasGoPro ? goproPrice * Math.max(0, goproCount) : 0;

  const totalAmount = baseAmount + goproAmount;
  return {
    baseAmount,
    goproAmount,
    totalAmount,
    baseRMB: formatPriceToRMB(baseAmount),
    goproRMB: formatPriceToRMB(goproAmount),
    totalRMB: formatPriceToRMB(totalAmount)
  };
}

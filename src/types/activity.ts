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


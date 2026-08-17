// src/types/api.ts

/**
 * API Response types
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
}

export interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: {
    records: T[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}

// Backend-compatible paginated response types
export interface IPageBlogVo {
  size: number;
  total: number;
  records: BlogVo[];
  current: number;
  pages: number;
}

export interface ResultIPageBlogVo {
  code: number;
  message: string;
  data: IPageBlogVo;
  timestamp?: number;
}

export interface IPageVipOrder {
  size: number;
  total: number;
  records: VipOrder[];
  current: number;
  pages: number;
}

export interface ResultIPageVipOrder {
  code: number;
  message: string;
  data: IPageVipOrder;
  timestamp?: number;
}

export interface ResultListVipType {
  code: number;
  message: string;
  data: VipType[];
  timestamp?: number;
}

export interface IPageCollectAddress {
  size: number;
  total: number;
  records: CollectedAddress[];
  current: number;
  pages: number;
}

export interface ResultIPageCollectAddress {
  code: number;
  message: string;
  data: IPageCollectAddress;
  timestamp?: number;
}

export interface ResultBlogCommentVo {
  code: number;
  message: string;
  data: BlogCommentVo;
  timestamp?: number;
}

export interface ResultCommentVo {
  code: number;
  message: string;
  data: Comment;
  timestamp?: number;
}

export interface ResultLocalDateTime {
  code: number;
  message: string;
  data: string; // ISO date string
  timestamp?: number;
}

export interface ResultListUsers {
  code: number;
  message: string;
  data: User[];
  timestamp?: number;
}

export interface IPageUsers {
  size: number;
  total: number;
  records: User[];
  current: number;
  pages: number;
}

export interface ResultIPageUsers {
  code: number;
  message: string;
  data: IPageUsers;
  timestamp?: number;
}

// --- NEW MEDIA & SUBSCRIPTION TYPES (Phase 1 Updates) ---

export interface MediaPageVo {
  records: string[]; // List of URLs
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface ResultMediaPageVo {
  code: number;
  message: string;
  data: MediaPageVo;
  timestamp?: number;
}

export interface SubscriptionVo {
  status: 'active' | 'expired' | 'past_due' | 'pending' | 'cancelled';
  planId: string; // e.g., "year", "month"
  vipTypeId: number;
  expiresAt: string; // ISO Date string
  autoRenew: boolean;
}

export interface ResultSubscriptionVo {
  code: number;
  message: string;
  data: SubscriptionVo;
  timestamp?: number;
}

export interface ResultFeatureList {
  code: number;
  message: string;
  data: string[]; // List of feature keys
  timestamp?: number;
}

export interface FeatureAccessResponse {
  hasAccess: boolean;
  upgradeMessage: string;
  requiredPlans: string[];
}

export interface ResultFeatureAccess {
  code: number;
  message: string;
  data: FeatureAccessResponse;
  timestamp?: number;
}

export interface SubscriptionPlanResponse {
  planId: string;
  planName: string;
  price: number;
  durationDays: number;
  features: string[];
  featureNames: string[];
}

export interface ResultSubscriptionPlans {
  code: number;
  message: string;
  data: SubscriptionPlanResponse[];
  timestamp?: number;
}

export interface UpgradeSuggestionResponse {
  recommendedPlan: string;
  features: string[];
  price: number;
  period: string;
}

export interface ResultUpgradeSuggestions {
  code: number;
  message: string;
  data: Record<string, UpgradeSuggestionResponse>;
  timestamp?: number;
}

// Author type for API responses
export interface Author {
  nickname: string;
  avatar?: string;
}

// --- NEW PAYMENT TYPES (Alipay Integration Guide) ---

export interface AliPayDto {
  out_trade_no: string;
  total_amount: number;
  subject: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  orderNo: string;
  status: number; // 0 = pending, 1 = paid
  amount: number;
  isPaid: boolean;
}

export interface CreateOrderRequest {
  planId: string; // 'week' | 'month' | 'year'
}

export interface PaymentResponse {
  success: boolean;
  paymentHtml?: string;
  paymentUrl?: string; // Keep for backwards compatibility with Stripe
  orderNo?: string;
  errorMessage?: string;
  errorCode?: string;
}

// -----------------------------------------------------------

// Specific API response types
export interface User {
  userId?: number;
  nickname?: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  role?: string;
  isDeleted?: boolean;
  imageurl?: string;
  firebaseUid?: string;
  isActive?: boolean;
  lastLoginAt?: string;
}

export interface UserDto {
  nickname: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  imageurl?: string;
}

// Backend response wrapper types
export interface ResultString {
  code: number;
  message: string;
  data: string;
  timestamp?: number;
}

export interface ResultUsers {
  code: number;
  message: string;
  data: User;
  timestamp?: number;
}

export interface ResultBoolean {
  code: number;
  message: string;
  data: boolean;
  timestamp?: number;
}

export interface ResultMapStringObject {
  code: number;
  message: string;
  data: Record<string, unknown>;
  timestamp?: number;
}

// Backwards compatibility alias
export type UserInfo = User;

export interface VipOrder {
  id?: number;
  userId?: number;
  vipTypeId?: number;
  orderNo?: string;
  amount?: number;
  status?: number;
  payType?: number;
  startTime?: string;
  endTime?: string;
  createAt?: string;
}

export interface VipType {
  id?: number;
  typeCode?: string;
  typeName?: string;
  price?: number;
  durationDays?: number;
  status?: number;
}

export interface BlogVo {
  blId?: number;
  userId?: number;
  title: string;
  excerpt?: string;
  content: string;
  tags?: string[];
  category?: string;
  categoryId?: number;
  isPublished?: boolean;
  slug?: string;
  like?: number;
  play?: number;
  imageUrl?: Array<{imgUrl: string}>;
  videoUrl?: Array<{viUrl: string}>;
  createdAt?: string;
  updatedAt?: string;
  author?: {
    nickname: string;
    avatar?: string;
  };
}

export interface BlogDto {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  categoryId?: number;
  isPublished?: boolean;
  imageUrl?: string[];
  videoUrl?: string[];
}

export interface BlogCommentVo extends BlogVo {
  comment?: Array<Comment>;
}

export interface Comment {
  id?: number;
  blId?: number;
  userId?: number;
  content: string;
  replyToCommentId?: number;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  author?: Author;
  likes?: number;
  isLiked?: boolean;
}

export interface ResultListString {
  code: number;
  message: string;
  data: string[];
  timestamp?: number;
}

export interface Image {
  imgUrl: string;
  imgSize?: number;
  isDeleted?: boolean;
}

export interface Video {
  viUrl?: string;
  viSize?: number;
  viDuration?: number;
  isDeleted?: boolean;
}

export interface BlogPost {
  blId?: number;
  userId?: number;
  title?: string;
  content?: string;
  blText?: string;
  like?: number;
  play?: number;
  imageUrl?: Array<{ imgUrl: string }>;
  videoUrl?: Array<{ viUrl: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface LocationInfo {
  city: string;
  country: string;
  address: string;
}

export interface WeatherInfo {
  city: string;
  weather: string;
  temperature: number;
  humidity: number;
  forecast: WeatherDay[];
}

export interface WeatherDay {
  date: string;
  weather: string;
  temperature: { high: number; low: number };
}

export interface WeatherForecast {
  forecasts: Array<WeatherDay>;
}

export interface CollectedAddress {
  id?: number;
  caName?: string;
  latitude?: number;
  longitude?: number;
  userId?: number;
  createdAt?: string;
}

export interface NationInfo {
  id?: number;
  nation?: string;
  code?: string;
  createdAt?: string;
}
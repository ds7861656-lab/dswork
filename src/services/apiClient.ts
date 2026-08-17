// Firebase API Client + SMS Authentication
// This version uses:
// - Firestore for blog operations
// - HTTP API for SMS authentication (Chinese version)

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  increment,
  addDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage } from '../../lib/firebase/client';
import axios, { type AxiosInstance, AxiosError } from 'axios';

// ============================================================================
// TYPE DEFINITIONS - BLOG
// ============================================================================

export interface BlogVo {
  blId?: number;
  title?: string;
  content?: string;
  excerpt?: string;
  imageUrl?: Array<{ imgUrl: string }>;
  videoUrl?: Array<{ viUrl: string }>;
  userId?: number;
  author?: {
    nickname?: string;
    avatar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  play?: number;
  like?: number;
  category?: string;
  categoryId?: number;
  tags?: string[];
  slug?: string;
  isPublished?: boolean;
  comment?: Array<Comment>;
}

export interface BlogDto {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  categoryId: number;
  isPublished: boolean;
  imageUrl?: string[];
  videoUrl?: string[];
}

export interface Comment {
  id?: number;
  author?: {
    nickname?: string;
    avatar?: string;
  };
  content?: string;
  createdAt?: string;
  likes?: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface PaginatedResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// ============================================================================
// TYPE DEFINITIONS - SMS AUTHENTICATION
// ============================================================================

export interface UserInfo {
  userId: number;
  email?: string;
  nickname?: string;
  phone?: string;
  gender?: string;
  imageurl?: string;
  birthDate?: string;
}

export interface UserDto {
  nickname: string;
  gender?: string;
  phone?: string;
  imageurl?: string;
  birthDate?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  msg?: string;
  data?: T;
}

export interface SmsCodeResponse {
  token?: string;
  userId?: number;
  phone?: string;
  nickname?: string;
  email?: string;
  payType?: number; // ✅ NEW: 0=Free, 1=Week, 2=Month, 3=Quarter, 4=Year
}

export interface EmailCodeResponse {
  token?: string;
  userId?: number;
  email?: string;
  nickname?: string;
  phone?: string;
}

export interface RegisterResponse {
  token: string;
  userId: number;
  phone?: string;
  email?: string;
  nickname?: string;
}

// Custom API Error
export class ApiError extends Error {
  public code?: number;
  public data?: any;

  constructor(message: string, code?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.data = data;
  }


  
}

export interface SmsCodeResponse {
  token?: string;
  userId?: number;
  phone?: string;
  nickname?: string;
  email?: string;
  payType?: number; // 0=Free, 1=Week, 2=Month, 3=Quarter, 4=Year
  startTime?: string | null; // ✅ Subscription start
  endTime?: string | null;   // ✅ Subscription end
}

export interface RegisterResponse {
  token: string;
  userId: number;
  phone?: string;
  email?: string;
  nickname?: string;
  payType?: number;          // ✅ Subscription status
  startTime?: string | null; // ✅ Subscription start
  endTime?: string | null;   // ✅ Subscription end
}

export interface UserFeaturesResponse {
  code: number;
  msg: string;
  data: {
    id: number;
    nickname: string;
    gender: string;
    birthDate: string;
    phone: string;
    password: null;
    email: string;
    role: string;
    createdAt: number;
    isDeleted: boolean;
    imageurl: string;
    isLoginQq: number;
    isActive: null;
    smsCode: null;
    smsCodeExpiry: null;
    emailCode: null;
    emailCodeExpiry: null;
    payType: number; // 0=Free, 1=Week, 2=Month, 3=Quarter, 4=Year
    startTime: string | null; // Subscription start date
    endTime: string | null; // Subscription end date
    lastLoginAt: number;
  };
}

// ============================================================================
// FIREBASE COLLECTIONS
// ============================================================================

const COLLECTIONS = {
  BLOGS: 'blogs',
  USERS: 'users',
  COMMENTS: 'comments',
  CATEGORIES: 'categories',
  MEDIA: 'user_media'
};

// ============================================================================
// HTTP CLIENT CONFIGURATION (for SMS Auth)
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://afreshtrip.cn/web';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateId = (): string => {
  return doc(collection(db, COLLECTIONS.BLOGS)).id;
};

const timestampToString = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return new Date().toISOString();
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const getCategoryName = (categoryId: number): string => {
  const categories: Record<number, string> = {
    1: 'Adventure',
    2: 'Culture',
    3: 'Food',
    4: 'Travel'
  };
  return categories[categoryId] || 'General';
};

// ============================================================================
// API CLIENT CLASS
// ============================================================================

class FirebaseApiClient {
  private httpClient: AxiosInstance;

  constructor() {
    // Initialize HTTP client for SMS authentication
    this.httpClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.httpClient.interceptors.request.use(
      (config) => {
        // Try to get custom auth token (for Chinese version SMS auth)
        const customToken = localStorage.getItem('custom_auth_token');
        if (customToken) {
          config.headers.Authorization = `Bearer ${customToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.httpClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse>) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('custom_auth_token');
          localStorage.removeItem('custom_user_data');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ==========================================================================
  // SMS AUTHENTICATION OPERATIONS
  // ==========================================================================

  /**
   * Send SMS verification code
   * POST /sms/send-code
   */
  async sendSmsCode(phone: string): Promise<ApiResponse<string>> {
    try {
      const response = await this.httpClient.post<ApiResponse<string>>('/sms/send-code', {
        phone,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify SMS code and login
   * POST /sms/verify-code
   */
  async verifySmsCode(phone: string, code: string): Promise<ApiResponse<SmsCodeResponse>> {
    try {
      const response = await this.httpClient.post<ApiResponse<SmsCodeResponse>>('/sms/verify-code', {
        phone,
        code,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserFeatures(): Promise<UserFeaturesResponse> {
  try {
    console.log('🔍 Fetching user features from API...');
    
    const response = await this.httpClient.get<UserFeaturesResponse>('/users/features');

    console.log('✅ User features fetched:', {
      nickname: response.data.data.nickname,
      payType: response.data.data.payType,
      startTime: response.data.data.startTime,
      endTime: response.data.data.endTime
    });

    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch user features:', error);
    throw this.handleError(error);
  }
}



  /**
   * Register new user with SMS verification
   * POST /sms/register
   */
  async registerWithSms(
    phone: string,
    code: string,
    password: string
  ): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await this.httpClient.post<ApiResponse<RegisterResponse>>('/sms/register', {
        phone,
        code,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================================================
  // EMAIL AUTHENTICATION OPERATIONS
  // ==========================================================================

  /**
   * Send email verification code
   * POST /email/send-code
   */
  async sendEmailCode(email: string): Promise<ApiResponse<string>> {
    try {
      const response = await this.httpClient.post<ApiResponse<string>>('/email/send-code', {
        email,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verify email code and login
   * POST /email/verify-code
   */
  async verifyEmailCode(email: string, code: string): Promise<ApiResponse<EmailCodeResponse>> {
    try {
      const response = await this.httpClient.post<ApiResponse<EmailCodeResponse>>('/email/verify-code', {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Register new user with email verification
   * POST /email/register
   */
  async registerWithEmail(
    email: string,
    code: string,
    password: string
  ): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await this.httpClient.post<ApiResponse<RegisterResponse>>('/email/register', {
        email,
        code,
        password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==========================================================================
  // USER PROFILE OPERATIONS
  // ==========================================================================

  /**
   * Get current user info
   * GET /user/info
   */
  async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await this.httpClient.get<ApiResponse<UserInfo>>('/user/info');
      if (response.data.code === 200 && response.data.data) {
        return response.data.data;
      }
      throw new ApiError('Failed to get user info', response.data.code);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   * PUT /user/profile
   */
async updateUserProfile(data: UserDto & { email?: string }): Promise<ApiResponse> {
  try {
    console.log('📝 Updating profile with data:', data);
    
    // ✅ Build request body conditionally
    const requestBody: any = {
      nickname: data.nickname,
      gender: data.gender,
      birthDate: data.birthDate,
      phone: data.phone,
      imageurl: data.imageurl || ''
    };

    // ✅ Only include email if it exists and is not empty
    // This prevents unique constraint errors when email is empty
    if (data.email && data.email.trim() !== '') {
      requestBody.email = data.email;
    }

    console.log('📤 Sending to API:', requestBody);

    const response = await this.httpClient.post<ApiResponse>('/users/profile', requestBody);

    console.log('✅ Profile updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to update profile:', error);
    throw this.handleError(error);
  }
}

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = 
        axiosError.response?.data?.message || 
        axiosError.response?.data?.msg || 
        axiosError.message || 
        'An unknown error occurred';
      
      const errorCode = axiosError.response?.data?.code || axiosError.response?.status;
      const errorData = axiosError.response?.data?.data;

      return new ApiError(errorMessage, errorCode, errorData);
    }

    if (error instanceof Error) {
      return new ApiError(error.message);
    }

    return new ApiError('An unknown error occurred');
  }

  // ==========================================================================
  // BLOG OPERATIONS (Firebase Firestore)
  // ==========================================================================

  /**
   * Get all blogs with pagination
   */
  async getBlogs(page: number = 1, size: number = 9): Promise<PaginatedResponse<BlogVo>> {
    try {
      const blogsRef = collection(db, COLLECTIONS.BLOGS);
      const q = query(
        blogsRef,
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const allBlogs: BlogVo[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        allBlogs.push({
          blId: parseInt(doc.id.slice(-8), 16), // Generate numeric ID from doc ID
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          imageUrl: data.images?.map((url: string) => ({ imgUrl: url })) || [],
          videoUrl: data.videos?.map((url: string) => ({ viUrl: url })) || [],
          userId: data.author?.id ? parseInt(data.author.id.slice(-8), 16) : 0,
          author: {
            nickname: data.author?.name || 'Anonymous',
            avatar: data.author?.avatar || ''
          },
          createdAt: timestampToString(data.createdAt),
          updatedAt: timestampToString(data.updatedAt),
          play: data.views || 0,
          like: data.likes || 0,
          category: data.category,
          categoryId: data.categoryId,
          tags: data.tags || [],
          slug: data.slug,
          isPublished: data.isPublished
        });
      });

      // Pagination
      const start = (page - 1) * size;
      const end = start + size;
      const paginatedBlogs = allBlogs.slice(start, end);

      return {
        records: paginatedBlogs,
        total: allBlogs.length,
        size,
        current: page,
        pages: Math.ceil(allBlogs.length / size)
      };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return {
        records: [],
        total: 0,
        size,
        current: page,
        pages: 0
      };
    }
  }

  /**
   * Get user's own blogs
   */
  async getUserBlogs(page: number = 1, size: number = 9, userId?: string): Promise<PaginatedResponse<BlogVo>> {
    try {
      if (!userId) {
        return {
          records: [],
          total: 0,
          size,
          current: page,
          pages: 0
        };
      }

      const blogsRef = collection(db, COLLECTIONS.BLOGS);
      const q = query(
        blogsRef,
        where('author.id', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const allBlogs: BlogVo[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        allBlogs.push({
          blId: parseInt(doc.id.slice(-8), 16),
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          imageUrl: data.images?.map((url: string) => ({ imgUrl: url })) || [],
          videoUrl: data.videos?.map((url: string) => ({ viUrl: url })) || [],
          userId: parseInt(userId.slice(-8), 16),
          author: {
            nickname: data.author?.name || 'Anonymous',
            avatar: data.author?.avatar || ''
          },
          createdAt: timestampToString(data.createdAt),
          updatedAt: timestampToString(data.updatedAt),
          play: data.views || 0,
          like: data.likes || 0,
          category: data.category,
          categoryId: data.categoryId,
          tags: data.tags || [],
          slug: data.slug,
          isPublished: data.isPublished
        });
      });

      const start = (page - 1) * size;
      const end = start + size;
      const paginatedBlogs = allBlogs.slice(start, end);

      return {
        records: paginatedBlogs,
        total: allBlogs.length,
        size,
        current: page,
        pages: Math.ceil(allBlogs.length / size)
      };
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      return {
        records: [],
        total: 0,
        size,
        current: page,
        pages: 0
      };
    }
  }

  /**
   * Get single blog by ID with comments
   */
  async getBlogById(blId: number): Promise<BlogVo> {
    try {
      // Search for blog by numeric ID (stored in blId field or derived from doc ID)
      const blogsRef = collection(db, COLLECTIONS.BLOGS);
      const snapshot = await getDocs(blogsRef);
      
      let blogDoc: any = null;
      let blogDocId: string = '';

      snapshot.forEach((doc) => {
        const numericId = parseInt(doc.id.slice(-8), 16);
        if (numericId === blId) {
          blogDoc = doc.data();
          blogDocId = doc.id;
        }
      });

      if (!blogDoc) {
        throw new Error('Blog not found');
      }

      // Increment view count
      await updateDoc(doc(db, COLLECTIONS.BLOGS, blogDocId), {
        views: increment(1)
      });

      // Get comments (mock for now - you can implement Firestore comments collection)
      const comments: Comment[] = [];

      return {
        blId: blId,
        title: blogDoc.title,
        content: blogDoc.content,
        excerpt: blogDoc.excerpt,
        imageUrl: blogDoc.images?.map((url: string) => ({ imgUrl: url })) || [],
        videoUrl: blogDoc.videos?.map((url: string) => ({ viUrl: url })) || [],
        userId: blogDoc.author?.id ? parseInt(blogDoc.author.id.slice(-8), 16) : 0,
        author: {
          nickname: blogDoc.author?.name || 'Anonymous',
          avatar: blogDoc.author?.avatar || ''
        },
        createdAt: timestampToString(blogDoc.createdAt),
        updatedAt: timestampToString(blogDoc.updatedAt),
        play: (blogDoc.views || 0) + 1,
        like: blogDoc.likes || 0,
        category: blogDoc.category,
        categoryId: blogDoc.categoryId,
        tags: blogDoc.tags || [],
        slug: blogDoc.slug,
        isPublished: blogDoc.isPublished,
        comment: comments
      };
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new blog post
   */
  async createBlog(blogData: BlogDto, userId: string, userEmail: string, userName?: string, userAvatar?: string): Promise<boolean> {
    try {
      const docId = generateId();
      const now = Timestamp.now();

      const blogPost = {
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt || '',
        images: blogData.imageUrl || [],
        videos: blogData.videoUrl || [],
        author: {
          id: userId,
          name: userName || userEmail,
          avatar: userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || userEmail)}&background=0d9488&color=fff`
        },
        date: now.toDate().toISOString(),
        views: 0,
        likes: 0,
        isLiked: false,
        isSaved: false,
        category: getCategoryName(blogData.categoryId),
        categoryId: blogData.categoryId,
        tags: blogData.tags || [],
        slug: generateSlug(blogData.title),
        isPublished: blogData.isPublished,
        createdAt: now,
        updatedAt: now
      };

      await setDoc(doc(db, COLLECTIONS.BLOGS, docId), blogPost);
      console.log('✅ Blog created in Firestore:', docId);
      
      return true;
    } catch (error) {
      console.error('❌ Error creating blog:', error);
      throw error;
    }
  }

  /**
   * Update blog post (PATCH - partial update)
   */
  async patchBlog(blId: number, updates: Partial<BlogDto>): Promise<boolean> {
    try {
      // Find blog by numeric ID
      const blogsRef = collection(db, COLLECTIONS.BLOGS);
      const snapshot = await getDocs(blogsRef);
      
      let blogDocId: string = '';

      snapshot.forEach((doc) => {
        const numericId = parseInt(doc.id.slice(-8), 16);
        if (numericId === blId) {
          blogDocId = doc.id;
        }
      });

      if (!blogDocId) {
        throw new Error('Blog not found');
      }

      const updateData: any = {
        updatedAt: Timestamp.now()
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.content) updateData.content = updates.content;
      if (updates.excerpt) updateData.excerpt = updates.excerpt;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.categoryId) {
        updateData.categoryId = updates.categoryId;
        updateData.category = getCategoryName(updates.categoryId);
      }
      if (updates.isPublished !== undefined) updateData.isPublished = updates.isPublished;
      if (updates.imageUrl) updateData.images = updates.imageUrl;
      if (updates.videoUrl) updateData.videos = updates.videoUrl;

      if (updates.title) {
        updateData.slug = generateSlug(updates.title);
      }

      await updateDoc(doc(db, COLLECTIONS.BLOGS, blogDocId), updateData);
      console.log('✅ Blog updated in Firestore:', blogDocId);
      
      return true;
    } catch (error) {
      console.error('❌ Error updating blog:', error);
      throw error;
    }
  }

  // ==========================================================================
  // FILE UPLOAD OPERATIONS (Firebase Storage)
  // ==========================================================================

  /**
   * Upload image to Firebase Storage
   */
async uploadFile(file: File, userId?: string): Promise<string> {
  try {
    console.log('📤 Uploading file to backend:', file.name, 'Size:', file.size, 'bytes');
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Optional: Add userId if needed
    if (userId) {
      formData.append('userId', userId);
    }

    console.log('⏳ Sending to POST /file/upload...');

    // Upload to backend
    const response = await this.httpClient.post('/file/upload', formData, {
      headers: {
        // Let browser set Content-Type with boundary
        'Content-Type': 'multipart/form-data'
      },
      // Increase timeout for large files
      timeout: 60000
    });

    console.log('📦 Upload response:', response.data);

    // Extract URL from response (try multiple possible paths)
    const imageUrl = 
      response.data?.url ||           // Direct url field
      response.data?.data?.url ||     // Nested in data.url
      response.data?.imageUrl ||      // imageUrl field
      response.data?.data?.imageUrl || // Nested in data.imageUrl
      response.data?.imageurl ||      // imageurl field (lowercase)
      response.data?.data?.imageurl;  // Nested in data.imageurl
    
    if (!imageUrl) {
      console.error('❌ No URL found in response:', response.data);
      throw new Error('Upload succeeded but no image URL in response');
    }
    
    console.log('✅ File uploaded successfully! URL:', imageUrl);
    return imageUrl;
    
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    
    if (error instanceof Error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
    
    throw new Error('File upload failed');
  }
}
  /**
   * Get user's media library
   */
  async getUserMedia(page: number = 1, size: number = 20, userId?: string): Promise<{
    images: string[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      if (!userId) {
        return { images: [], total: 0, hasMore: false };
      }

      const folderPath = `blogs/${userId}`;
      const storageRef = ref(storage, folderPath);
      
      const result = await listAll(storageRef);
      const imageUrls: string[] = [];

      for (const itemRef of result.items) {
        const url = await getDownloadURL(itemRef);
        imageUrls.push(url);
      }

      // Sort by newest first (timestamp in filename)
      imageUrls.sort().reverse();

      // Pagination
      const start = (page - 1) * size;
      const end = start + size;
      const paginatedImages = imageUrls.slice(start, end);

      return {
        images: paginatedImages,
        total: imageUrls.length,
        hasMore: end < imageUrls.length
      };
    } catch (error) {
      console.error('Error fetching user media:', error);
      return { images: [], total: 0, hasMore: false };
    }
  }

  // ==========================================================================
  // COMMENT OPERATIONS (Mock - implement Firestore comments later)
  // ==========================================================================

  async toggleCommentLike(commentId: number): Promise<boolean> {
    // Mock implementation - return true (liked)
    console.log('Mock: Toggle comment like', commentId);
    return true;
  }

  async addComment(blId: number, content: string, replyToId?: number): Promise<Comment> {
    // Mock implementation
    console.log('Mock: Add comment to blog', blId, content, replyToId);
    return {
      id: Date.now(),
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      author: {
        nickname: 'Current User',
        avatar: ''
      },
      replies: []
    };
  }

// ============================================
// STATIC FEATURE ACCESS (NO EXTERNAL TYPES)
// ============================================

async checkFeatureAccess(
  userId: string,
  featureId: string
): Promise<{
  hasAccess: boolean;
  requiredPlans: string[];
  userPlan?: string;
  upgradeMessage?: string;
}> {

  // 🔹 Simple static rule:
  // Only "premium_feature" requires upgrade

  const premiumFeatures = ['premium_feature', 'advanced_ai', 'pro_weather'];

  const hasAccess = !premiumFeatures.includes(featureId);

  return {
    hasAccess,
    requiredPlans: hasAccess ? [] : ['month', 'year'],
    userPlan: 'free',
    upgradeMessage: hasAccess
      ? undefined
      : 'Upgrade to premium to unlock this feature.',
  };
}

async getLocationInfo(latitude: number, longitude: number) {
  return {
    city: "Paris",
    country: "France",
    latitude,
    longitude,
    address: "Champs-Élysées, Paris, France" // add this
  };
}
async getAccessibleFeatures(userId: string): Promise<string[]> {
  // 🔹 Static accessible features
  return [
    'basic_trip_view',
    'basic_weather',
    'basic_comment'
  ];
}


async getUpgradeSuggestions(
  userId: string,
  featureIds: string[]
): Promise<
  Partial<
    Record<
      string,
      {
        recommendedPlan: string;
        features: string[];
        price: number;
        period: string;
      }
    >
  >
> {

  const suggestions: Partial<
    Record<
      string,
      {
        recommendedPlan: string;
        features: string[];
        price: number;
        period: string;
      }
    >
  > = {};

  featureIds.forEach((featureId) => {
    suggestions[featureId] = {
      recommendedPlan: 'month',
      features: [featureId],
      price: 39,
      period: 'month',
    };
  });

  return suggestions;
}


}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const apiClient = new FirebaseApiClient();

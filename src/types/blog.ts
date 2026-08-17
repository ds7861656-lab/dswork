export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface BlogPost {
  id: string;
  userId?: string;  
  title: string;
  content: string; // Full content for details view
  excerpt?: string; // Short summary for listing view
  images: string[]; // Array of image URLs
  videos: string[]; // Array of video URLs
  author: Author;
  date: string; // Publication date (ISO string)
  views: number;
  likes: number;
  isLiked?: boolean; // User-specific like status
  likedBy: string[]; // User-specific like status
  isSaved?: boolean; // User-specific save status
  category: string;
  categoryId?: number; // Category ID for API operations
  tags?: string[]; // Optional tags for filtering/searching
  slug: string; // URL-friendly identifier
  isPublished: boolean;
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
  comments?: Comment[];  // 
}

export interface CreateBlogPostInput {
  title: string;
  content: string;
  excerpt?: string;
  categoryId: number; // Use categoryId for API
  tags?: string[];
  images: string[];
  videos: string[];
  isPublished: boolean;
}

// Type for blog post listing (subset of fields for performance)
export interface BlogPostSummary {
  id: string;
  title: string;
  excerpt: string;
  images: string[]; // Usually just the first image
  videos: string[]; // Array of video URLs
  author: Author;
  date: string;
  views: number;
  likes: number;
  category: string;
  slug: string;
}

// Type for blog post filters
export interface BlogFilters {
  category?: string;
  authorId?: string;
  tags?: string[];
  isPublished?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// Type for blog post sorting options
export type BlogSortOption = 'date' | 'views' | 'likes' | 'title';

// Type for blog post statistics
export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  postsByCategory: Record<string, number>;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}
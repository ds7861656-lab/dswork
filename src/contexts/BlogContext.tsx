// src/contexts/BlogContext.tsx
// ✅ FIXED: No auto-refresh, author checks, comment support

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import * as blogApi from '../services/blogApi';
import type { BlogPost, Comment, CreateBlogPostInput } from '../types/blog';

interface BlogContextType {
  blogPosts: BlogPost[];
  loading: boolean;
  error: string | null;
  getAllBlogPosts: () => BlogPost[];
  getBlogPostById: (id: string) => Promise<BlogPost | null>;
  getPostById: (id: string) => BlogPost | undefined;
  getBlogDetails: (id: string) => Promise<{ post: BlogPost; comments: Comment[] }>;
  getBlogPostsPaginated: (page: number, size: number) => Promise<{
    posts: BlogPost[];
    total: number;
    hasMore: boolean;
  }>;
  getBlogPostsByCategory: (categorySlug: string) => Promise<BlogPost[]>;
  getUserBlogs: (page: number, size: number) => Promise<{
    posts: BlogPost[];
    total: number;
    hasMore: boolean;
  }>;
  getRelatedPosts: (currentId: string, category: string, limit?: number) => BlogPost[];
  createBlogPost: (post: CreateBlogPostInput) => Promise<string>;
  updateBlogPost: (id: string, updates: Partial<CreateBlogPostInput>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  addNewPost: (post: BlogPost) => void;
  updatePostStatistics: (id: string, stats: { 
    views?: number; 
    likes?: number; 
    isLiked?: boolean; 
    isSaved?: boolean;
  }) => void;
  toggleLike: (postId: string, currentIsLiked: boolean) => Promise<{ likes: number; isLiked: boolean }>;
  uploadImage: (file: File) => Promise<string>;
  getUserMediaLibrary: (page?: number, size?: number) => Promise<{
    images: string[];
    total: number;
    hasMore: boolean;
  }>;
  toggleCommentLike: (commentId: string) => Promise<boolean>;
  addComment: (blId: string, content: string, replyToId?: string) => Promise<Comment>;
  refreshBlogPosts: () => Promise<void>;
  canUserEdit: (post: BlogPost) => boolean;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ FIX: Use ref to prevent infinite loops
  const isInitialMount = useRef(true);

  // ✅ FIX: Stable refresh function with no dependencies
  const refreshBlogPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Refreshing blog posts...');
      
      const posts = await blogApi.getAllBlogPosts();
      setBlogPosts(posts);
      
      console.log('✅ Loaded', posts.length, 'posts');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
      setError(errorMessage);
      console.error('❌ Error loading posts:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ No dependencies = stable function

  // ✅ FIX: Load posts ONLY on mount, NOT on every render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      refreshBlogPosts();
    }
  }, []); // ✅ Empty dependency array = runs once

  const getAllBlogPosts = useCallback(() => {
    return blogPosts;
  }, [blogPosts]);

  const getPostById = useCallback((id: string) => {
    return blogPosts.find(p => p.id === id);
  }, [blogPosts]);

  const getBlogPostById = useCallback(async (id: string): Promise<BlogPost | null> => {
    try {
      console.log('📖 Fetching post:', id);
      const post = await blogApi.getBlogPostById(id);
      return post;
    } catch (err) {
      console.error('❌ Error fetching post:', err);
      return null;
    }
  }, []);

  const getBlogDetails = useCallback(async (id: string): Promise<{ post: BlogPost; comments: Comment[] }> => {
    try {
      console.log('📖 Fetching blog details:', id);
      
      const post = await blogApi.getBlogPostById(id);
      
      if (!post) {
        throw new Error('Post not found');
      }

      // ✅ Get comments from post
      const flatComments: Comment[] = (post as any).comments || [];
      
      // ✅ Nest comments so replies group under parents
      const nestedComments = blogApi.nestCommentReplies(flatComments);
      
      console.log('✅ Fetched blog details with', nestedComments.length, 'comments');
      return { post, comments: nestedComments };
    } catch (err) {
      console.error('❌ Error fetching blog details:', err);
      throw err;
    }
  }, []);

  const getBlogPostsPaginated = useCallback(async (page: number, size: number) => {
    try {
      console.log('📊 Fetching paginated posts:', { page, size });
      
      const allPosts = await blogApi.getAllBlogPosts();
      
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedPosts = allPosts.slice(startIndex, endIndex);
      
      console.log('✅ Fetched', paginatedPosts.length, 'posts (page', page, 'of', Math.ceil(allPosts.length / size), ')');
      
      return {
        posts: paginatedPosts,
        total: allPosts.length,
        hasMore: endIndex < allPosts.length
      };
    } catch (err) {
      console.error('❌ Error fetching paginated posts:', err);
      return {
        posts: [],
        total: 0,
        hasMore: false
      };
    }
  }, []);

  const getBlogPostsByCategory = useCallback(async (categorySlug: string): Promise<BlogPost[]> => {
    try {
      console.log('📂 Fetching posts by category:', categorySlug);
      const posts = await blogApi.getBlogPostsByCategory(categorySlug);
      console.log('✅ Found', posts.length, 'posts in category');
      return posts;
    } catch (err) {
      console.error('❌ Error fetching posts by category:', err);
      return [];
    }
  }, []);

  const getUserBlogs = useCallback(async (page: number, size: number) => {
    try {
      if (!user) {
        console.log('⚠️ No user logged in');
        return {
          posts: [],
          total: 0,
          hasMore: false
        };
      }

      console.log('📊 Fetching user blogs for:', user.uid);
      
      const userPosts = await blogApi.getUserBlogPosts();
      
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedPosts = userPosts.slice(startIndex, endIndex);
      
      console.log('✅ Fetched', paginatedPosts.length, 'user posts');
      
      return {
        posts: paginatedPosts,
        total: userPosts.length,
        hasMore: endIndex < userPosts.length
      };
    } catch (err) {
      console.error('❌ Error fetching user posts:', err);
      return {
        posts: [],
        total: 0,
        hasMore: false
      };
    }
  }, [user]);

  const getRelatedPosts = useCallback((currentId: string, category: string, limit: number = 3) => {
    return blogPosts
      .filter(p => p.id !== currentId && p.category === category && p.isPublished)
      .slice(0, limit);
  }, [blogPosts]);

  const createBlogPost = useCallback(async (data: CreateBlogPostInput): Promise<string> => {
    if (!user) {
      throw new Error('❌ User must be logged in to create posts');
    }

    try {
      setLoading(true);
      console.log('✨ Creating blog post...');
      console.log('👤 User:', user.uid);
      console.log('📝 Title:', data.title);
      console.log('🖼️ Images:', data.images?.length || 0);
      
      const postId = await blogApi.createBlogPost(data);
      
      console.log('✅ Post created! ID:', postId);

      // Refresh to show new post
      await refreshBlogPosts();
      
      return postId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      console.error('❌ Error creating post:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, refreshBlogPosts]);

  const updateBlogPost = useCallback(async (id: string, updates: Partial<CreateBlogPostInput>) => {
    // ✅ Check if user can edit
    const post = blogPosts.find(p => p.id === id);
    if (post && !blogApi.canEditPost(post, user?.uid)) {
      throw new Error('You are not authorized to edit this post');
    }

    // Optimistic update
    setBlogPosts(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
    );

    try {
      console.log('📝 Updating post:', id);
      await blogApi.updateBlogPost(id, updates);
      console.log('✅ Post updated!');
      
      // Refresh to get updated data
      await refreshBlogPosts();
    } catch (err) {
      console.error('❌ Failed to update post:', err);
      await refreshBlogPosts(); // Revert on error
      throw err;
    }
  }, [user, blogPosts, refreshBlogPosts]);

  const deleteBlogPost = useCallback(async (id: string) => {
    // ✅ Check if user can delete
    const post = blogPosts.find(p => p.id === id);
    if (post && !blogApi.canEditPost(post, user?.uid)) {
      throw new Error('You are not authorized to delete this post');
    }

    try {
      console.log('🗑️ Deleting post:', id);
      await blogApi.deleteBlogPost(id);
      console.log('✅ Post deleted!');
      
      // Remove from state
      setBlogPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('❌ Failed to delete post:', err);
      throw err;
    }
  }, [user, blogPosts]);

  const addNewPost = useCallback((post: BlogPost) => {
    setBlogPosts(prev => [post, ...prev]);
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    if (!user) {
      throw new Error('❌ User must be logged in to upload images');
    }

    try {
      console.log('📤 Uploading image...');
      console.log('👤 User:', user.uid);
      console.log('📁 File:', file.name, '|', file.size, 'bytes');
      
      const url = await blogApi.uploadBlogMedia(file);
      
      console.log('✅ Image uploaded!');
      return url;
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      
      if (err.code === 'storage/unauthorized') {
        throw new Error('Permission denied. Make sure you are logged in and Storage rules are updated.');
      }
      
      throw err;
    }
  }, [user]);

  const getUserMediaLibrary = useCallback(async (page: number = 1, size: number = 20) => {
    try {
      if (!user) {
        return { images: [], total: 0, hasMore: false };
      }

      console.log('📸 Fetching media library...');
      
      // Mock implementation (replace with real API later)
      const mockImages: string[] = [];
      
      return {
        images: mockImages,
        total: mockImages.length,
        hasMore: false
      };
    } catch (err) {
      console.error('❌ Failed to load media:', err);
      return { images: [], total: 0, hasMore: false };
    }
  }, [user]);

  const updatePostStatistics = useCallback((id: string, stats: {
    views?: number;
    likes?: number;
    isLiked?: boolean;
    isSaved?: boolean;
  }) => {
    setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, ...stats } : p));
  }, []);

  const toggleLike = useCallback(async (postId: string, currentIsLiked: boolean): Promise<{ likes: number; isLiked: boolean }> => {
    if (!user) {
      throw new Error('User must be logged in to like posts');
    }

    try {
      console.log('❤️ Toggling like for post:', postId, 'Current isLiked:', currentIsLiked);
      
      // ✅ Pass currentIsLiked state to togglePostLike
      // This ensures backend sends correct type: 1 for like, 0 for unlike
      const result = await blogApi.togglePostLike(postId, currentIsLiked);
      
      console.log('✅ Like toggled! New state:', result);
      
      // Update local state
      setBlogPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: result.likes,
            isLiked: result.isLiked,
            likedBy: result.isLiked 
              ? [...(p.likedBy || []), user.uid]
              : (p.likedBy || []).filter((id: string) => id !== user.uid)
          };
        }
        return p;
      }));
      
      return result;
    } catch (err) {
      console.error('❌ Error toggling like:', err);
      throw err;
    }
  }, [user]);

  const toggleCommentLike = useCallback(async (commentId: string): Promise<boolean> => {
    try {
      console.log('❤️ Toggling like for comment:', commentId);
      
      // ✅ Call actual API instead of mock
      const isLiked = await blogApi.toggleCommentLike(commentId);
      
      console.log('✅ Comment like toggled! isLiked:', isLiked);
      return isLiked;
    } catch (err) {
      console.error('❌ Error toggling comment like:', err);
      throw err;
    }
  }, []);

  const addComment = useCallback(async (blId: string, content: string, replyToId?: string): Promise<Comment> => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      console.log('💬 Adding comment to blog:', blId);
      if (replyToId) {
        console.log('💬 Reply to comment:', replyToId);
      }

      // ✅ Use real API
      const newComment = await blogApi.addComment(blId, content, replyToId);
      
      console.log('✅ Comment added successfully!');
      return newComment;
    } catch (err) {
      console.error('❌ Error adding comment:', err);
      throw err;
    }
  }, [user]);

  // ✅ Helper function to check if user can edit post
  const canUserEdit = useCallback((post: BlogPost): boolean => {
    return blogApi.canEditPost(post, user?.uid);
  }, [user]);

  const value: BlogContextType = {
    blogPosts,
    loading,
    error,
    getAllBlogPosts,
    getBlogPostById,
    getPostById,
    getBlogDetails,
    getBlogPostsPaginated,
    getBlogPostsByCategory,
    getUserBlogs,
    getRelatedPosts,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addNewPost,
    updatePostStatistics,
    toggleLike,
    uploadImage,
    getUserMediaLibrary,
    toggleCommentLike,
    addComment,
    refreshBlogPosts,
    canUserEdit
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

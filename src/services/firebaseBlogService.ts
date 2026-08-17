// Firebase Blog Service - Direct Firestore Operations
// NEVER uses "anonymous" - always requires authenticated user

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
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage, auth } from '../../lib/firebase/client';
import type { BlogPost, CreateBlogPostInput } from '../types/blog';

const BLOG_COLLECTION = 'blogs';
const CATEGORIES_COLLECTION = 'categories';

// Helper to convert Firestore timestamp to ISO string
const timestampToString = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return new Date().toISOString();
};

// Generate unique ID
const generateId = (): string => {
  return doc(collection(db, BLOG_COLLECTION)).id;
};

// 🔥 Upload image - REQUIRES AUTHENTICATION (NO ANONYMOUS)
export const uploadImage = async (file: File): Promise<string> => {
  // 🚨 CRITICAL: Get current authenticated user
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('❌ User must be authenticated to upload images');
  }

  // 🚨 CRITICAL: Use REAL user UID (never "anonymous")
  const userId = user.uid;
  
  if (!userId) {
    throw new Error('❌ User ID not found');
  }

  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    // 🔥 Upload path MUST match Storage rules: blogs/{userId}/{fileName}
    const uploadPath = `blogs/${userId}/${fileName}`;
    const storageRef = ref(storage, uploadPath);
    
    console.log('📤 Uploading to:', uploadPath);
    console.log('👤 User ID:', userId);
    console.log('📁 File:', file.name, '|', file.type, '|', file.size, 'bytes');
    
    // Upload with content type
    await uploadBytes(storageRef, file, {
      contentType: file.type
    });
    
    const downloadURL = await getDownloadURL(storageRef);
    console.log('✅ Image uploaded successfully!');
    console.log('🔗 Download URL:', downloadURL);
    
    return downloadURL;
  } catch (error: any) {
    console.error('❌ Image upload failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

// 🔥 Create blog post - REQUIRES AUTHENTICATION
export const createBlogPost = async (
  data: CreateBlogPostInput
): Promise<string> => {
  // 🚨 CRITICAL: Get current authenticated user
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('❌ User must be authenticated to create posts');
  }

  // 🚨 CRITICAL: Use REAL user data (never "anonymous")
  const userId = user.uid;
  const userEmail = user.email || 'no-email';
  const userName = user.displayName || user.email || 'Anonymous User';
  const userAvatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0d9488&color=fff`;

  try {
    const postId = generateId();
    const now = Timestamp.now();
    
    const blogPost = {
      id: postId,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || '',
      images: data.images || [],
      videos: data.videos || [],
      author: {
        id: userId,  // 🔥 Real UID
        name: userName,
        avatar: userAvatar
      },
      date: now.toDate().toISOString(),
      views: 0,
      likes: 0,
      isLiked: false,
      isSaved: false,
      category: getCategoryName(data.categoryId || 1),
      categoryId: data.categoryId || 1,
      tags: data.tags || [],
      slug: generateSlug(data.title),
      isPublished: data.isPublished ?? true,
      createdAt: now,
      updatedAt: now
    };
    
    console.log('💾 Creating post for user:', userId);
    console.log('📝 Post ID:', postId);
    
    await setDoc(doc(db, BLOG_COLLECTION, postId), blogPost);
    console.log('✅ Blog post created successfully!');
    
    return postId;
  } catch (error) {
    console.error('❌ Error creating blog post:', error);
    throw error;
  }
};

// Update blog post
export const updateBlogPost = async (
  postId: string,
  data: Partial<CreateBlogPostInput>
): Promise<void> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    
    const updateData: any = {
      updatedAt: Timestamp.now()
    };
    
    // Only update fields that are provided
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.videos !== undefined) updateData.videos = data.videos;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
    
    if (data.categoryId !== undefined) {
      updateData.categoryId = data.categoryId;
      updateData.category = getCategoryName(data.categoryId);
    }
    
    if (data.title) {
      updateData.slug = generateSlug(data.title);
    }
    
    console.log('📝 Updating post:', postId);
    await updateDoc(docRef, updateData);
    console.log('✅ Post updated!');
  } catch (error) {
    console.error('❌ Error updating post:', error);
    throw error;
  }
};

// Get single blog post
export const getBlogPost = async (postId: string): Promise<BlogPost | null> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.log('⚠️ Post not found:', postId);
      return null;
    }
    
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      date: timestampToString(data.date || data.createdAt),
      createdAt: timestampToString(data.createdAt),
      updatedAt: timestampToString(data.updatedAt)
    } as BlogPost;
  } catch (error) {
    console.error('❌ Error fetching post:', error);
    return null;
  }
};

// Get all blog posts (paginated)
export const getBlogPosts = async (
  page: number = 1,
  pageSize: number = 9,
  filters?: {
    category?: string;
    isPublished?: boolean;
    authorId?: string;
  }
): Promise<{ posts: BlogPost[]; total: number }> => {
  try {
    let q = query(collection(db, BLOG_COLLECTION));
    
    // Apply filters
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    if (filters?.isPublished !== undefined) {
      q = query(q, where('isPublished', '==', filters.isPublished));
    }
    
    if (filters?.authorId) {
      q = query(q, where('author.id', '==', filters.authorId));
    }
    
    // Order by date (newest first)
    q = query(q, orderBy('createdAt', 'desc'));
    
    console.log('📊 Fetching posts from Firestore...');
    const allDocs = await getDocs(q);
    const total = allDocs.size;
    
    console.log('✅ Found', total, 'posts');
    
    // Pagination

    
  const allDocsArray = allDocs.docs;
const startIndex = (page - 1) * pageSize;
const endIndex = startIndex + pageSize;
const posts: BlogPost[] = [];

for (let i = startIndex; i < endIndex && i < allDocsArray.length; i++) {
  const doc = allDocsArray[i];
  const data = doc.data();
  posts.push({
    ...data,
    id: doc.id,
    date: timestampToString(data.date || data.createdAt),
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt)
  } as BlogPost);
}
    
    return { posts, total };
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    return { posts: [], total: 0 };
  }
};

// Delete blog post
export const deleteBlogPost = async (postId: string): Promise<void> => {
  try {
    console.log('🗑️ Deleting post:', postId);
    await deleteDoc(doc(db, BLOG_COLLECTION, postId));
    console.log('✅ Post deleted!');
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    throw error;
  }
};

// Increment view count
export const incrementViews = async (postId: string): Promise<void> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('❌ Error incrementing views:', error);
  }
};

// Toggle like
export const toggleLike = async (postId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, BLOG_COLLECTION, postId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const data = docSnap.data();
    const currentLikes = data.likes || 0;
    const isLiked = data.isLiked || false;
    
    await updateDoc(docRef, {
      likes: isLiked ? currentLikes - 1 : currentLikes + 1,
      isLiked: !isLiked
    });
    
    return !isLiked;
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    throw error;
  }
};

// Get user's media library
export const getUserMedia = async (
  page: number = 1,
  pageSize: number = 20
): Promise<{ images: string[]; total: number; hasMore: boolean }> => {
  // 🚨 CRITICAL: Get current authenticated user
  const user = auth.currentUser;
  
  if (!user) {
    console.log('⚠️ No user logged in');
    return { images: [], total: 0, hasMore: false };
  }

  const userId = user.uid;

  try {
    const folderPath = `blogs/${userId}`;
    const storageRef = ref(storage, folderPath);
    
    console.log('📸 Fetching media from:', folderPath);
    const result = await listAll(storageRef);
    const imageUrls: string[] = [];

    for (const itemRef of result.items) {
      const url = await getDownloadURL(itemRef);
      imageUrls.push(url);
    }

    imageUrls.sort().reverse();

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedImages = imageUrls.slice(start, end);

    console.log('✅ Fetched', imageUrls.length, 'images');

    return {
      images: paginatedImages,
      total: imageUrls.length,
      hasMore: end < imageUrls.length
    };
  } catch (error) {
    console.error('❌ Error fetching media:', error);
    return { images: [], total: 0, hasMore: false };
  }
};

// Get categories
export const getCategories = async () => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(categoriesRef);
    
    if (snapshot.empty) {
      return [
        { id: '1', name: 'Adventure', slug: 'adventure', color: '#F59E0B', icon: 'mountain' },
        { id: '2', name: 'Culture', slug: 'culture', color: '#8B5CF6', icon: 'landmark' },
        { id: '3', name: 'Food', slug: 'food', color: '#EF4444', icon: 'utensils' },
        { id: '4', name: 'Travel', slug: 'travel', color: '#0d9488', icon: 'plane' }
      ];
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
};

// Helper: Get category name from ID
const getCategoryName = (categoryId: number): string => {
  const categories: Record<number, string> = {
    1: 'Adventure',
    2: 'Culture',
    3: 'Food',
    4: 'Travel'
  };
  return categories[categoryId] || 'General';
};

// Helper: Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Initialize default categories
export const initializeCategories = async () => {
  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(categoriesRef);
    
    if (snapshot.empty) {
      console.log('⚙️ Initializing categories...');
      const batch = writeBatch(db);
      const defaultCategories = [
        { id: '1', name: 'Adventure', slug: 'adventure', color: '#F59E0B', icon: 'mountain' },
        { id: '2', name: 'Culture', slug: 'culture', color: '#8B5CF6', icon: 'landmark' },
        { id: '3', name: 'Food', slug: 'food', color: '#EF4444', icon: 'utensils' },
        { id: '4', name: 'Travel', slug: 'travel', color: '#0d9488', icon: 'plane' }
      ];
      
      defaultCategories.forEach(category => {
        const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
        batch.set(docRef, category);
      });
      
      await batch.commit();
      console.log('✅ Categories initialized!');
    }
  } catch (error) {
    console.error('❌ Error initializing categories:', error);
  }
};

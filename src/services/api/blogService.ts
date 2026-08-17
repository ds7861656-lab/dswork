// src/services/blogApi.ts (or blogService.ts)
// Complete Blog API - UPDATED with slug support and likes

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
  increment,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { db, storage, auth } from '../../../lib/firebase/client'; 
import type { BlogPost, CreateBlogPostInput, Comment, BlogFilters } from '../../types/blog';

const BLOG_COLLECTION = 'blogs';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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

// Category ID to Name mapping
const getCategoryName = (categoryId: number): string => {
  const categories: Record<number, string> = {
    1: 'Adventure',
    2: 'Culture',
    3: 'Food',
    4: 'Travel'
  };
  return categories[categoryId] || 'General';
};

// ✅ NEW: Category SLUG to Name mapping
const getCategoryNameFromSlug = (slug: string): string => {
  const slugMap: Record<string, string> = {
    'adventure': 'Adventure',
    'culture': 'Culture',
    'food': 'Food',
    'travel': 'Travel'
  };
  return slugMap[slug.toLowerCase()] || '';
};

// ============================================================================
// IMAGE UPLOAD
// ============================================================================

export const uploadBlogImage = async (file: File): Promise<string> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be authenticated to upload images');
  }

  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const uploadPath = `blogs/${user.uid}/${fileName}`;
  const storageRef = ref(storage, uploadPath);
  
  console.log('📤 Uploading image to:', uploadPath);
  
  await uploadBytes(storageRef, file, {
    contentType: file.type
  });
  
  const downloadURL = await getDownloadURL(storageRef);
  console.log('✅ Image uploaded:', downloadURL);
  
  return downloadURL;
};

// ============================================================================
// CREATE BLOG POST
// ============================================================================

export const createBlogPost = async (input: CreateBlogPostInput): Promise<string> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be authenticated to create posts');
  }

  const categoryName = getCategoryName(input.categoryId);
  const slug = generateSlug(input.title);

  console.log('✨ Creating blog post...');
  console.log('Title:', input.title);
  console.log('Category:', categoryName);
  console.log('Slug:', slug);

  const postData = {
    title: input.title,
    content: input.content,
    excerpt: input.excerpt || '',
    category: categoryName,
    categoryId: input.categoryId,
    tags: input.tags || [],
    images: input.images || [],
    videos: input.videos || [],
    slug: slug,
    isPublished: input.isPublished,
    views: 0,
    likes: 0,
    likedBy: [], // ✅ NEW: Track who liked this post
    author: {
      id: user.uid,
      name: user.displayName || 'Anonymous',
      avatar: user.photoURL || ''
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    date: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, BLOG_COLLECTION), postData);
  
  console.log('✅ Post created with ID:', docRef.id);
  return docRef.id;
};

// ============================================================================
// READ OPERATIONS
// ============================================================================

// Get all published posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  console.log('📖 Fetching all published blog posts...');
  
  const blogsRef = collection(db, BLOG_COLLECTION);
  const q = query(
    blogsRef,
    where('isPublished', '==', true),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const currentUserId = auth.currentUser?.uid;
  
  const posts: BlogPost[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      images: data.images || [],
      videos: data.videos || [],
      author: data.author,
      date: timestampToString(data.createdAt),
      views: data.views || 0,
      likes: data.likes || 0,
      isLiked: currentUserId ? (data.likedBy || []).includes(currentUserId) : false, // ✅ NEW
      likedBy: data.likedBy || [], // ✅ NEW
      isSaved: false,
      category: data.category,
      categoryId: data.categoryId,
      tags: data.tags || [],
      slug: data.slug,
      isPublished: data.isPublished,
      createdAt: timestampToString(data.createdAt),
      updatedAt: timestampToString(data.updatedAt)
    };
  });

  console.log('✅ Found', posts.length, 'published posts');
  return posts;
};

// ✅ UPDATED: Get posts by category SLUG
export const getBlogPostsByCategory = async (categorySlug: string): Promise<BlogPost[]> => {
  console.log('📖 Fetching posts in category (slug):', categorySlug);
  
  // Convert slug to category name
  const categoryName = getCategoryNameFromSlug(categorySlug);
  
  if (!categoryName) {
    console.warn('⚠️ Unknown category slug:', categorySlug);
    return [];
  }

  console.log('📂 Looking for category name:', categoryName);
  
  const blogsRef = collection(db, BLOG_COLLECTION);
  const q = query(
    blogsRef,
    where('category', '==', categoryName),
    where('isPublished', '==', true),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const currentUserId = auth.currentUser?.uid;
  
  const posts: BlogPost[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      images: data.images || [],
      videos: data.videos || [],
      author: data.author,
      date: timestampToString(data.createdAt),
      views: data.views || 0,
      likes: data.likes || 0,
      isLiked: currentUserId ? (data.likedBy || []).includes(currentUserId) : false, // ✅ NEW
      likedBy: data.likedBy || [], // ✅ NEW
      isSaved: false,
      category: data.category,
      categoryId: data.categoryId,
      tags: data.tags || [],
      slug: data.slug,
      isPublished: data.isPublished,
      createdAt: timestampToString(data.createdAt),
      updatedAt: timestampToString(data.updatedAt)
    };
  });

  console.log('✅ Found', posts.length, 'posts in category', categoryName);
  return posts;
};

// Get single post by ID
export const getBlogPostById = async (postId: string): Promise<BlogPost | null> => {
  console.log('📖 Fetching post:', postId);
  
  const docRef = doc(db, BLOG_COLLECTION, postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.warn('⚠️ Post not found:', postId);
    return null;
  }

  const data = docSnap.data();
  const currentUserId = auth.currentUser?.uid;

  // Increment view count
  await updateDoc(docRef, {
    views: increment(1)
  });

  const post: BlogPost = {
    id: docSnap.id,
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    images: data.images || [],
    videos: data.videos || [],
    author: data.author,
    date: timestampToString(data.createdAt),
    views: (data.views || 0) + 1,
    likes: data.likes || 0,
    isLiked: currentUserId ? (data.likedBy || []).includes(currentUserId) : false, // ✅ NEW
    likedBy: data.likedBy || [], // ✅ NEW
    isSaved: false,
    category: data.category,
    categoryId: data.categoryId,
    tags: data.tags || [],
    slug: data.slug,
    isPublished: data.isPublished,
    createdAt: timestampToString(data.createdAt),
    updatedAt: timestampToString(data.updatedAt)
  };

  console.log('✅ Post loaded:', post.title);
  return post;
};

// Get user's own posts
export const getUserBlogPosts = async (): Promise<BlogPost[]> => {
  const user = auth.currentUser;
  
  if (!user) {
    console.warn('⚠️ No user logged in');
    return [];
  }

  console.log('📖 Fetching user posts for:', user.uid);
  
  const blogsRef = collection(db, BLOG_COLLECTION);
  const q = query(
    blogsRef,
    where('author.id', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  
  const posts: BlogPost[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      images: data.images || [],
      videos: data.videos || [],
      author: data.author,
      date: timestampToString(data.createdAt),
      views: data.views || 0,
      likes: data.likes || 0,
      isLiked: (data.likedBy || []).includes(user.uid),
      likedBy: data.likedBy || [],
      isSaved: false,
      category: data.category,
      categoryId: data.categoryId,
      tags: data.tags || [],
      slug: data.slug,
      isPublished: data.isPublished,
      createdAt: timestampToString(data.createdAt),
      updatedAt: timestampToString(data.updatedAt)
    };
  });

  console.log('✅ Found', posts.length, 'user posts');
  return posts;
};

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

export const updateBlogPost = async (
  postId: string,
  updates: Partial<CreateBlogPostInput>
): Promise<void> => {
  console.log('📝 Updating post:', postId);

  const docRef = doc(db, BLOG_COLLECTION, postId);
  
  const updateData: any = { ...updates };
  
  if (updates.categoryId) {
    updateData.category = getCategoryName(updates.categoryId);
  }
  
  if (updates.title) {
    updateData.slug = generateSlug(updates.title);
  }

  updateData.updatedAt = serverTimestamp();

  await updateDoc(docRef, updateData);
  console.log('✅ Post updated');
};

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

export const deleteBlogPost = async (postId: string): Promise<void> => {
  console.log('🗑️ Deleting post:', postId);
  
  const docRef = doc(db, BLOG_COLLECTION, postId);
  await deleteDoc(docRef);
  
  console.log('✅ Post deleted');
};

// ============================================================================
// ✅ NEW: LIKE FUNCTIONALITY
// ============================================================================

/**
 * Toggle like on a blog post
 * @param postId - Post ID
 * @returns boolean - true if liked, false if unliked
 */
export const toggleLike = async (postId: string): Promise<boolean> => {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be logged in to like posts');
  }

  const userId = user.uid;
  const docRef = doc(db, BLOG_COLLECTION, postId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Post not found');
  }

  const data = docSnap.data();
  const likedBy = data.likedBy || [];
  const isLiked = likedBy.includes(userId);

  if (isLiked) {
    // Unlike
    console.log('👎 Unliking post:', postId);
    await updateDoc(docRef, {
      likes: increment(-1),
      likedBy: likedBy.filter((id: string) => id !== userId)
    });
    return false;
  } else {
    // Like
    console.log('👍 Liking post:', postId);
    await updateDoc(docRef, {
      likes: increment(1),
      likedBy: [...likedBy, userId]
    });
    return true;
  }
};

/**
 * Check if current user liked a post
 * @param post - BlogPost object
 * @returns boolean - true if user liked the post
 */
export const isPostLikedByUser = (post: BlogPost): boolean => {
  if (!auth.currentUser) return false;
  return (post.likedBy || []).includes(auth.currentUser.uid);
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  getCategoryName,
  getCategoryNameFromSlug, // ✅ NEW
  generateSlug,
  timestampToString
};
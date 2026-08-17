// src/services/api/categoryService.ts
// Updated to work WITHOUT backend API - NO localhost:8080 calls!

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  blogCount?: number;
}

// Hardcoded categories (no API needed!)
const CATEGORIES: Category[] = [
  { 
    id: 1, 
    name: 'Adventure', 
    slug: 'Adventure', 
    color: '#F59E0B', 
    icon: 'mountain',
    isActive: true,
    sortOrder: 1
  },
  { 
    id: 2, 
    name: 'Culture', 
    slug: 'Culture', 
    color: '#8B5CF6', 
    icon: 'landmark',
    isActive: true,
    sortOrder: 2
  },
  { 
    id: 3, 
    name: 'Food', 
    slug: 'Food', 
    color: '#EF4444', 
    icon: 'utensils',
    isActive: true,
    sortOrder: 3
  },

];

/**
 * Category service - NO BACKEND NEEDED
 * Categories are hardcoded since they rarely change
 */
export class CategoryService {
  /**
   * Get all active categories
   * @returns Promise<Category[]> - Array of categories
   */
  async getCategories(): Promise<Category[]> {
    console.log('📂 Getting categories (hardcoded, no API call)');
    // Simulate async to maintain API contract
    return Promise.resolve(CATEGORIES.filter(c => c.isActive));
  }

  /**
   * Get category by slug
   * @param slug - Category slug
   * @returns Promise<Category> - Category details
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = CATEGORIES.find(c => c.slug === slug);
    if (!category) {
      throw new Error(`Category not found: ${slug}`);
    }
    return Promise.resolve(category);
  }

  /**
   * Get category by ID
   * @param id - Category ID
   * @returns Promise<Category> - Category details
   */
  async getCategoryById(id: number): Promise<Category> {
    const category = CATEGORIES.find(c => c.id === id);
    if (!category) {
      throw new Error(`Category not found: ${id}`);
    }
    return Promise.resolve(category);
  }

  /**
   * Get all categories (including inactive) for admin
   * @returns Promise<Category[]> - All categories
   */
  async getAllCategories(): Promise<Category[]> {
    return Promise.resolve(CATEGORIES);
  }
}

// Export singleton instance
export const categoryService = new CategoryService();

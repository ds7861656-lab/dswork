// src/services/api/userService.ts

import { HttpClient } from './httpClient';
import type { 
  User, 
  UserDto, 
  ResultUsers, 
  ResultBoolean,
  ResultListUsers,
  ResultIPageUsers,
  IPageUsers
} from '../../types/api';

/**
 * User service for handling user-related endpoints
 */
export class UserService extends HttpClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Get current user info (regular user endpoint)
    */
  async getUserInfo(): Promise<User> {
    const response = await this.get<ResultUsers>('/api/v1/users/profile');
    return response.data;
  }

  /**
    * Update user profile (regular user endpoint)
    */
  async updateUserProfile(userData: UserDto): Promise<boolean> {
    const response = await this.put<ResultBoolean>('/api/v1/users/profile', userData);
    console.log('Update profile response:', response);
    return response.data;
  }

  /**
   * Get current user profile (admin endpoint - for backward compatibility)
   */
  async getUserProfileAdmin(): Promise<User> {
    const response = await this.get<ResultUsers>('/api/v1/admin/users/profile');
    return response.data;
  }

  /**
   * Update user profile (admin endpoint - for backward compatibility)
   */
  async updateUserProfileAdmin(userData: UserDto): Promise<boolean> {
    const response = await this.put<ResultBoolean>('/api/v1/admin/users/profile', userData);
    return response.data;
  }

  /**
    * Get user by email
    */
  async getUserByEmail(userEmail: string): Promise<User> {
    const response = await this.get<ResultUsers>(`/api/v1/admin/users/${userEmail}`);
    return response.data;
  }

  /**
   * Get all users with pagination
   */
  async getUsers(page: number = 0, size: number = 20): Promise<IPageUsers> {
    const response = await this.get<ResultIPageUsers>(
      `/api/v1/admin/users?page=${page}&size=${size}`
    );
    return response.data;
  }

  /**
   * Search users
   */
  async searchUsers(keyword: string): Promise<User[]> {
    const response = await this.get<ResultListUsers>(
      `/api/v1/admin/users/search?query=${encodeURIComponent(keyword)}`
    );
    return response.data;
  }

  /**
   * Update user status
   */
  async updateUserStatus(userEmail: string, isActive: boolean): Promise<boolean> {
    const response = await this.put<ResultBoolean>(
      `/api/v1/admin/users/${userEmail}/status`,
      { isActive }
    );
    return response.data;
  }

}
// src/services/api/profileApi.ts

import { HttpClient } from './httpClient';

// Create HttpClient instance
const httpClient = new HttpClient('https://afreshtrip.cn/web');

/**
 * Profile Update Request Interface
 */
export interface ProfileUpdateRequest {
  nickname: string;
  gender: string;
  birthDate: string;
  phone: string;

  imageurl?: string;
}

/**
 * Profile Update Response Interface
 */
export interface ProfileUpdateResponse {
  code: number;
  msg: string;
  data?: {
    userId: number;
    nickname: string;
    gender: string;
    birthDate: string;
    phone: string;

    imageurl: string;
  };
}

/**
 * Update user profile
 * POST /users/profile
 */
export const updateUserProfile = async (
  data: ProfileUpdateRequest
): Promise<ProfileUpdateResponse> => {
  try {
    console.log('📝 Updating profile with data:', data);
    
    const response = await httpClient.post<ProfileUpdateResponse>('/users/profile', {
      nickname: data.nickname,
      gender: data.gender,
      birthDate: data.birthDate,
      phone: data.phone,
      imageurl: data.imageurl || ''
    });

    console.log('✅ Profile updated successfully:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Error updating profile:', error);
    throw error;
  }
};

/**
 * Upload file to server
 */
export const uploadFile = async (file: File): Promise<string> => {
  try {
    console.log('📤 Uploading file:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<any>('/file/upload', formData, {
      requiresAuth: true
    });

    // Extract URL from response
    const url = response?.data?.url || 
                response?.data?.imageUrl || 
                response?.url ||
                response?.imageurl;
    
    console.log('✅ File uploaded successfully:', url);
    return url;
  } catch (error: any) {
    console.error('❌ Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (file: File): Promise<string> => {
  return uploadFile(file);
};

/**
 * Get user profile
 */
export const getUserProfile = async (): Promise<ProfileUpdateResponse> => {
  try {
    console.log('📋 Fetching user profile...');
    
    const response = await httpClient.get<ProfileUpdateResponse>('/users/profile', {
      requiresAuth: true
    });
    
    console.log('✅ Profile fetched:', response);
    return response;
  } catch (error: any) {
    console.error('❌ Error fetching profile:', error);
    throw error;
  }
};
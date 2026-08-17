import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase/client';
import { apiClient, type UserFeaturesResponse } from '../services/apiClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../lib/react-query/queryKeys';
import { updateUserPayType } from '../utils/chineseLoginStorage';

// Custom user type for Chinese authentication
interface CustomUser {
  uid: string;
  email?: string;
  phone?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  isCustomAuth: true;
  payType?: number;
  startTime?: string | null;
  endTime?: string | null;
  metadata?: {
    creationTime: string;
  };
}

// Union type for Firebase or Custom user
export type AuthUser = User | CustomUser;

interface AuthContextType {
  user: AuthUser | null;
  userProfile: any | null;
  userFeatures: UserFeaturesResponse['data'] | null; // ✅ NEW: Full user features from API
  loading: boolean;
  isCustomAuth: boolean;
  payType: number; // ✅ From API
  startTime: string | null; // ✅ Subscription start
  endTime: string | null; // ✅ Subscription end
  isPremium: boolean; // ✅ Checks payType AND endTime
  isExpired: boolean; // ✅ NEW: Check if subscription expired
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithSms: (phone: string, code: string) => Promise<void>;
  registerWithSms: (phone: string, code: string, password: string) => Promise<void>;
  loginWithEmailCode: (email: string, code: string) => Promise<void>;
  loginWithAlipay: () => Promise<void>;
  loginWithWeChat: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profileData: {
    nickname?: string;
    gender?: string;
    phone?: string;
    imageUrl?: string;
    birthDate?: string;
  }) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshUserFeatures: () => Promise<void>; // ✅ NEW: Refresh from API
  updatePayType: (payType: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [customUser, setCustomUser] = useState<CustomUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const queryClient = useQueryClient();

  // ✅ NEW: Fetch user features from API (includes payType, startTime, endTime)
  const { data: userFeaturesData, refetch: refetchFeatures } = useQuery<UserFeaturesResponse['data']>({
    queryKey: ['userFeatures', customUser?.uid || firebaseUser?.uid],
    queryFn: async () => {
      if (!customUser && !firebaseUser) throw new Error('No user');
      
      try {
        console.log('🔍 Fetching user features from API...');
        const response = await apiClient.getUserFeatures();
        
        // ✅ Update localStorage with API data
        if (response.data.payType !== undefined) {
          updateUserPayType(response.data.payType);
        }
        
        console.log('✅ User features loaded:', {
          nickname: response.data.nickname,
          payType: response.data.payType,
          startTime: response.data.startTime,
          endTime: response.data.endTime
        });
        
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user features:', error);
        throw error;
      }
    },
    enabled: !!(customUser || firebaseUser),
    retry: 1,
    staleTime: 30 * 1000, // 30 seconds
  });

  // ✅ Extract payType, startTime, endTime from API
  const payType = userFeaturesData?.payType ?? 0;
  const startTime = userFeaturesData?.startTime ?? null;
  const endTime = userFeaturesData?.endTime ?? null;

  // ✅ Check if subscription is expired
  const isExpired = endTime ? new Date(endTime) < new Date() : false;
  
  // ✅ isPremium: has VIP AND not expired
  const isPremium = payType > 0 && !isExpired;

  // React Query for User Profile (legacy)
  const { data: userProfileData, isLoading: isProfileLoading } = useQuery<any>({
    queryKey: QUERY_KEYS.user.profile((firebaseUser?.uid || customUser?.uid) || ''),
    queryFn: async () => {
      if (!firebaseUser && !customUser) throw new Error('No user');
      try {
        if (firebaseUser) {
          await firebaseUser.getIdToken(false);
        }
        return await apiClient.getUserInfo();
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        const user = firebaseUser || customUser;
        if (user) {
          return {
            userId: parseInt(user.uid, 10),
            email: user.email || undefined,
            nickname: user.displayName || undefined,
            imageurl: firebaseUser?.photoURL || undefined,
          };
        }
        throw error;
      }
    },
    enabled: !!(firebaseUser || customUser),
    retry: false,
  });

  const userProfile = userProfileData || null;

  useEffect(() => {
    const isChineseVersion = import.meta.env.VITE_IS_CHINESE_VERSION === 'true';

    if (!isChineseVersion) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed:', user ? 'authenticated' : 'not authenticated');
        setFirebaseUser(user);
        setAuthLoading(false);
      });

      return unsubscribe;
    } else {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    const isChineseVersion = import.meta.env.VITE_IS_CHINESE_VERSION === 'true';

    if (isChineseVersion) {
      const customToken = localStorage.getItem('custom_auth_token');
      const customUserData = localStorage.getItem('custom_user_data');

      if (customToken) {
        if (customUserData) {
          try {
            const parsedUser: CustomUser = JSON.parse(customUserData);
            setCustomUser(parsedUser);
            console.log('Restored custom auth state:', parsedUser.displayName || parsedUser.phone);
          } catch (error) {
            console.error('Failed to parse stored custom user data:', error);
            localStorage.removeItem('custom_auth_token');
            localStorage.removeItem('custom_user_data');
          }
        }
      }
    }
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithSms = async (phone: string, code: string) => {
    try {
      console.log('🔐 Starting SMS login...');
      const response = await apiClient.verifySmsCode(phone, code);

      if (response.code !== 200 || !response.data?.token || !response.data?.userId) {
        throw new Error(response.message || 'SMS verification failed');
      }

      console.log('✅ SMS login successful');

      // Store token
      localStorage.setItem('custom_auth_token', response.data.token);

      // Create custom user
      const mockCustomUser: CustomUser = {
        uid: response.data.userId.toString(),
        phone: response.data.phone || phone,
        displayName: response.data.nickname || phone,
        emailVerified: true,
        isCustomAuth: true,
        payType: response.data.payType || 0,
        startTime: response.data.startTime || null,
        endTime: response.data.endTime || null
      };

      localStorage.setItem('custom_user_data', JSON.stringify(mockCustomUser));
      setCustomUser(mockCustomUser);

      // ✅ Fetch features from API (happens automatically via React Query)
      await refetchFeatures();

    } catch (error) {
      console.error('❌ SMS login error:', error);
      throw error;
    }
  };

  const registerWithSms = async (phone: string, code: string, password: string) => {
    try {
      const response = await apiClient.registerWithSms(phone, code, password);

      if (response.code !== 200 || !response.data?.token || !response.data?.userId) {
        throw new Error(response.message || 'SMS registration failed');
      }

      localStorage.setItem('custom_auth_token', response.data.token);

      const mockCustomUser: CustomUser = {
        uid: response.data.userId.toString(),
        phone: response.data.phone || phone,
        displayName: response.data.nickname || phone,
        emailVerified: true,
        isCustomAuth: true,
        payType: response.data.payType || 0,
        startTime: response.data.startTime || null,
        endTime: response.data.endTime || null,
        metadata: {
          creationTime: new Date().toISOString(),
        }
      };

      localStorage.setItem('custom_user_data', JSON.stringify(mockCustomUser));
      setCustomUser(mockCustomUser);

      // ✅ Fetch features from API
      await refetchFeatures();

    } catch (error) {
      console.error('SMS registration error:', error);
      throw error;
    }
  };

  const loginWithEmailCode = async (email: string, code: string) => {
    try {
      const response = await apiClient.verifyEmailCode(email, code);

      if (response.code !== 200 || !response.data?.token || !response.data?.userId) {
        throw new Error(response.message || 'Email verification failed');
      }

      localStorage.setItem('custom_auth_token', response.data.token);

      const mockCustomUser: CustomUser = {
        uid: response.data.userId.toString(),
        email: response.data.email || email,
        displayName: response.data.nickname || email,
        emailVerified: true,
        isCustomAuth: true,
       
      };

      localStorage.setItem('custom_user_data', JSON.stringify(mockCustomUser));
      setCustomUser(mockCustomUser);

      // ✅ Fetch features from API
      await refetchFeatures();

    } catch (error) {
      console.error('Email login error:', error);
      throw error;
    }
  };

  const loginWithAlipay = async () => {
    console.log('Alipay login initiated');
    throw new Error('Alipay login not yet implemented');
  };

  const loginWithWeChat = async () => {
    console.log('WeChat login initiated');
    throw new Error('WeChat login not yet implemented');
  };

  const logout = async () => {
    try {
      if (firebaseUser) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Firebase logout error:', error);
    }

    // Clear custom auth
    localStorage.removeItem('custom_auth_token');
    localStorage.removeItem('custom_user_data');
    localStorage.removeItem('payType');
    setCustomUser(null);

    // Clear cache
    queryClient.clear();
  };

  const refreshUserProfile = async () => {
    const user = firebaseUser || customUser;
    if (!user) return;

    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.user.profile(user.uid)
    });
  };

  // ✅ NEW: Refresh user features from API
  const refreshUserFeatures = async () => {
    console.log('🔄 Refreshing user features...');
    await refetchFeatures();
  };

const updateUserProfile = async (profileData: {
  nickname?: string;
  gender?: string;
  phone?: string;
  imageUrl?: string;
  birthDate?: string;
}) => {
  try {
    // ✅ Build request data conditionally
    const userDto: any = {
      nickname: profileData.nickname || '',
      gender: profileData.gender,
      phone: profileData.phone,
      imageurl: profileData.imageUrl,
      birthDate: profileData.birthDate,
    };

    // ✅ Only include email if it exists and is not empty
    const currentEmail = userFeaturesData?.email;
    if (currentEmail && currentEmail.trim() !== '') {
      userDto.email = currentEmail;
    }
    // If email is empty, don't send it at all to avoid unique constraint error!

    console.log('📝 Updating user profile:', userDto);

    const response = await apiClient.updateUserProfile(userDto);
    
    if (response) {
      console.log('✅ Profile update complete');
      
      // ✅ Refresh both profile and features
      await refreshUserProfile();
      await refreshUserFeatures();
    } else {
      throw new Error('Failed to update profile');
    }
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

  // ✅ Update payType (manual override, but API is source of truth)
  const updatePayType = (newPayType: number) => {
    console.log('📝 Updating payType to:', newPayType);
    
    // Update localStorage
    updateUserPayType(newPayType);
    
    // ✅ Refresh from API to get startTime and endTime
    refreshUserFeatures();
  };

  const loading = authLoading || (!!firebaseUser && isProfileLoading);
  const user = customUser || firebaseUser;
  const isCustomAuth = !!customUser;

  const value = {
    user,
    userProfile,
    userFeatures: userFeaturesData || null, // ✅ NEW
    loading,
    isCustomAuth,
    payType, // ✅ From API
    startTime, // ✅ From API
    endTime, // ✅ From API
    isPremium, // ✅ Checks expiry
    isExpired, // ✅ NEW
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithSms,
    registerWithSms,
    loginWithEmailCode,
    loginWithAlipay,
    loginWithWeChat,
    logout,
    updateUserProfile,
    refreshUserProfile,
    refreshUserFeatures, // ✅ NEW
    updatePayType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
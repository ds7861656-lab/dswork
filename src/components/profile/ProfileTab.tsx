// src/components/profile/ProfileTab.tsx
// ✅ FIXED: Upload image first to get URL, then update profile

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/apiClient';

interface ProfileTabProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  onSubmit,
  isLoading
}) => {
  const { t } = useTranslation();
  const { userFeatures } = useAuth();
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  // ✅ Form data from API (no email)
  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    birthDate: '',
    gender: '',
    imageurl: ''
  });

  // ✅ Sync form with userFeatures from API
  useEffect(() => {
    if (userFeatures) {
      console.log('📋 Loading profile from API:', userFeatures);
      
      setFormData({
        nickname: userFeatures.nickname || '',
        phone: userFeatures.phone || '',
        birthDate: userFeatures.birthDate ? userFeatures.birthDate.split('T')[0] : '',
        gender: userFeatures.gender || '',
        imageurl: userFeatures.imageurl || ''
      });
      
      setAvatarPreview(userFeatures.imageurl || '');
      console.log('✅ Form populated from API');
    }
  }, [userFeatures]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Handle avatar upload - upload to backend first to get URL
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    try {
      console.log('📤 Uploading avatar to backend:', file.name);
      
      // 1. Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // 2. Upload to backend to get URL
      console.log('⏳ Uploading to /file/upload...');
      const imageUrl = await apiClient.uploadFile(file);
      
      console.log('✅ Image uploaded! URL:', imageUrl);
      
      // 3. Store URL in formData
      setFormData(prev => ({ ...prev, imageurl: imageUrl }));
      
      console.log('✅ Image URL ready for profile update');
      
    } catch (error) {
      console.error('❌ Avatar upload failed:', error);
      alert('Failed to upload avatar. Please try again.');
      
      // Reset preview on error
      setAvatarPreview(formData.imageurl);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Submitting profile update...');
    console.log('Data:', {
      nickname: formData.nickname,
      phone: formData.phone,
      birthDate: formData.birthDate,
      gender: formData.gender,
      imageurl: formData.imageurl ? 'URL provided' : 'no image'
    });
    
    // ✅ Submit to parent component (imageurl is now a URL, not base64)
    await onSubmit(formData);
  };

  // ✅ Show loading state
  if (!userFeatures) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Avatar */}
      <div className="lg:col-span-1">
        <div className="text-center">
          <div className="relative inline-block">
            <img
              src={avatarPreview || formData.imageurl || '/assets/default-avatar.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.currentTarget.src = '/assets/default-avatar.png';
              }}
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-teal-600 rounded-full text-white cursor-pointer hover:bg-teal-700 transition-colors shadow-lg"
            >
              {isUploadingAvatar ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CameraIcon className="w-5 h-5" />
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isUploadingAvatar}
              />
            </label>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {formData.nickname || 'User'}
          </h3>
          <p className="text-sm text-gray-500">{userFeatures.phone}</p>
          
          {/* Upload Status */}
          {isUploadingAvatar && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
              <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-700 font-medium">
                Uploading image...
              </span>
            </div>
          )}
          
          {!isUploadingAvatar && formData.imageurl && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full">
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></div>
              <span className="text-xs text-teal-700 font-medium">
                Chinese Backend API
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Edit Form (NO EMAIL) */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {t('trips.editProfileInfo') || 'Edit Profile Information'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('trips.username') || 'Username'}
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Mobile & DOB Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('trips.mobileNumber') || 'Mobile Number'}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('trips.dateOfBirth') || 'Date of Birth'}
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Gender Radio Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('trips.gender') || 'Gender'}
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">{t('profile.male') || 'Male'}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">{t('profile.female') || 'Female'}</span>
              </label>
            </div>
          </div>

          {/* Update Button */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <button
              type="submit"
              disabled={isLoading || isUploadingAvatar}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('common.updating') || 'Updating...'}
                </div>
              ) : (
                t('trips.update') || 'Update Profile'
              )}
            </button>
          </div>
        </form>

      
      </div>
    </div>
  );
};

export default ProfileTab;

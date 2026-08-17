import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';

interface ProfileHeaderProps {
  onAvatarUpdate?: (file: File) => void;
  isUpdatingAvatar?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  onAvatarUpdate,
  isUpdatingAvatar = false
}) => {
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const { userSubscription } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine membership status
  const isPremium = userSubscription && userSubscription.status === 'active';
  const planName = isPremium 
    ? (userSubscription?.planId === 'year' ? 'VIP Year' : 'VIP Member') 
    : t('profile.header.freeAccount');

  // Format join date (fallback to current year if missing)
  const joinYear = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).getFullYear() 
    : new Date().getFullYear();

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarUpdate) {
      onAvatarUpdate(file);
    }
  };

  const displayName = userProfile?.nickname || user?.displayName || user?.email?.split('@')[0] || 'Traveler';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
      {/* Banner Section */}
      <div className="h-32 bg-linear-to-r from-teal-600 to-emerald-500 relative">
        <div className="absolute inset-0 opacity-20 bg-[url('/assets/pattern.svg')]"></div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 gap-6">
          
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden relative">
              <img 
                src={userProfile?.imageurl || user?.photoURL || "https://ui-avatars.com/api/?name=" + displayName} 
                alt="Profile" 
                className={`w-full h-full object-cover transition-opacity duration-200 ${isUpdatingAvatar ? 'opacity-50' : ''}`}
              />
              
              {/* Upload Overlay */}
              <div 
                onClick={handleFileClick}
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white text-xs font-medium">{t('profile.header.changePhoto')}</span>
              </div>

              {/* Loading Spinner */}
              {isUpdatingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              )}
            </div>
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
            />
          </div>

          {/* User Info Section */}
          <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user?.email}
              </span>
              <span className="hidden md:inline text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('profile.header.memberSince', { year: joinYear })}
              </span>
            </div>
          </div>

          {/* Status Badge & Actions */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-xs ${
              isPremium 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
              {planName}
            </div>
          </div>
        </div>

        {/* Quick Stats (Optional / Future proofing) */}
        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 mt-8 pt-6">
          <div className="text-center">
            <span className="block text-xl font-bold text-gray-900">0</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">{t('profile.stats.tripsPlanned')}</span>
          </div>
          <div className="text-center border-l border-gray-100">
            <span className="block text-xl font-bold text-gray-900">0</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">{t('profile.stats.savedItems')}</span>
          </div>
          <div className="text-center border-l border-gray-100">
            <span className="block text-xl font-bold text-gray-900">0</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">{t('profile.stats.reviewsLeft')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
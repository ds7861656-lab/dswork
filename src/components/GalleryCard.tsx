import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface GalleryCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  views: number;
  category: string;
  date: string;
  userAvatar: string;
  userName: string;
  likes?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  readLink?: string;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
  loading?: boolean;
  showEdit?: boolean;
  onEdit?: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  id,
  image,
  title,
  description,
  views,
  category,
  date,
  userAvatar,
  userName,
  likes = 0,
  isLiked = false,
  isSaved = false,
  readLink = '#',
  onLike,
  onSave,
  onShare,
  loading = false,
  showEdit,
  onEdit,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likesCount, setLikesCount] = useState(likes);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    if (onLike) {
      onLike(id);
    } else {
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(id);
    } else {
      setSaved(!saved);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(id);
    } else {
      if (navigator.share) {
        navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        }).catch(err => console.error('Error sharing:', err));
      } else {
        navigator.clipboard.writeText(window.location.href)
          .then(() => alert(t('galleryCard.linkCopied')))
          .catch(err => console.error('Error copying link:', err));
      }
    }
  };

  const getLocale = () => {
    switch (i18n.language) {
      case 'fr': return 'fr-FR';
      case 'es': return 'es-ES';
      case 'zh': return 'zh-CN';
      default: return 'en-US';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(getLocale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const translateCategory = (cat: string) => {
    // Basic mapping check to avoid key errors if category is raw string
    const key = cat.replace(/ /g, '').replace('&', ''); 
    // If translation exists, return it, otherwise return original
    // Note: In a real app, you'd likely map specific backend slugs to translation keys
    return t(`blog.${key}`, cat);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 h-full flex flex-col">
        <div className="w-full aspect-4/3 bg-gray-200 animate-pulse"></div>
        <div className="p-6 flex-1 flex flex-col space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          <div className="mt-auto flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={readLink}
      className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden relative"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Category Badge - Top Left */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-teal-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
            {translateCategory(category)}
          </span>
        </div>

        {/* Action Buttons - Top Right (Visible on Group Hover) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full shadow-md backdrop-blur-md transition-colors ${
              liked 
                ? 'bg-red-50 text-red-500' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button
            onClick={handleSave}
            className={`p-2 rounded-full shadow-md backdrop-blur-md transition-colors ${
              saved 
                ? 'bg-yellow-50 text-yellow-500' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-yellow-500'
            }`}
            aria-label={saved ? 'Unsave' : 'Save'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-full shadow-md backdrop-blur-md bg-white/90 text-gray-600 hover:bg-white hover:text-blue-500 transition-colors"
            aria-label="Share"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 2.943-9.543 7a9.97 9.97 0 011.827 3.342M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {showEdit && (
        <button
          onClick={(e) => { e.preventDefault(); onEdit?.(); }}
          className="absolute top-4 right-20 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 hover:scale-110 active:scale-95 transition-all duration-200 z-20 animate-pulse"
          aria-label="Edit post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}

      {/* Content Container */}
      <div className="p-6 pt-8 flex flex-col grow relative">
        {/* Avatar - Overlapping Image and Text */}
        <div className="absolute -top-6 right-6 z-10">
          <div className="relative">
            <img
              src={userAvatar || '/assets/default-avatar.png'}
              alt={userName}
              className="w-12 h-12 rounded-full object-cover border-4 border-white shadow-md bg-white"
              onError={(e) => {
                e.currentTarget.src = '/assets/default-avatar.png';
              }}
            />
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-3 uppercase tracking-wide font-medium">
          <span>{formatDate(date)}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {formatNumber(views)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 font-serif group-hover:text-teal-700 transition-colors leading-tight">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {userName}
          </span>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center group-hover:translate-x-1 transition-transform">
            {t('galleryCard.readMore')}
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default GalleryCard;
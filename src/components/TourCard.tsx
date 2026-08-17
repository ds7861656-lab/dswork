import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TourCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  rating: number;
  reviewCount: number;
  location: string;
  category?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
  linkTo?: string;
  className?: string;
  loading?: boolean;
  isLiked?: boolean;
  isSaved?: boolean;
  badgeText?: string;
  highlightColor?: string;
  showQuickView?: boolean;
  onQuickView?: (id: string) => void;
}

const TourCard: React.FC<TourCardProps> = ({
  id,
  image,
  title,
  description,
  price,
  originalPrice,
  duration,
  rating,
  reviewCount,
  location,
  category,
  isFeatured = false,
  isOnSale = false,
  buttonText,
  onButtonClick,
  onLike,
  onSave,
  onShare,
  linkTo,
  className = '',
  loading = false,
  isLiked = false,
  isSaved = false,
  badgeText,
  highlightColor = 'teal',
  showQuickView = false,
  onQuickView,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const { t } = useTranslation();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLike) {
      onLike(id);
    } else {
      setLiked(!liked);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSave) {
      onSave(id);
    } else {
      setSaved(!saved);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(id);
    } else {
      // Default share functionality
      if (navigator.share) {
        navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        }).catch(err => console.error('Error sharing:', err));
      } else {
        // Fallback: copy link to clipboard
        navigator.clipboard.writeText(window.location.href)
          .then(() => alert(t('tourCard.linkCopied')))
          .catch(err => console.error('Error copying link:', err));
      }
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(id);
    }
  };

  const handleCardClick = () => {
    if (linkTo) {
      // Navigation will be handled by Link component
    } else if (onButtonClick) {
      onButtonClick();
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({reviewCount})</span>
      </div>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!originalPrice || !price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
        <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-4 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const CardContent = (
    <>
      <div className="relative">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        {imageError ? (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            className={`w-full h-48 object-cover transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-0 left-0 flex flex-col gap-1 p-2">
          {isFeatured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              {t('tourCard.featured')}
            </span>
          )}
          {isOnSale && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {t('tourCard.sale')}
            </span>
          )}
          {badgeText && (
            <span className={`bg-${highlightColor}-600 text-white text-xs font-bold px-2 py-1 rounded`}>
              {badgeText}
            </span>
          )}
        </div>
        
        {/* Discount Badge */}
        {originalPrice && originalPrice > price && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
            {calculateDiscount()}% {t('common.off')}
          </div>
        )}
        
        {/* Quick Actions */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {showQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label={t('tourCard.quickView')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}
          <button
            onClick={handleLike}
            className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label={liked ? t('tourCard.unlike') : t('tourCard.like')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${liked ? 'text-red-500 fill-current' : ''}`} fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleSave}
            className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label={saved ? t('tourCard.unsave') : t('tourCard.save')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${saved ? 'text-yellow-500 fill-current' : ''}`} fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label={t('tourCard.share')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 2.943-9.543 7a9.97 9.97 0 001.827 3.342M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{title}</h3>
          {category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {category}
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
          <span className="mx-2">·</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {duration}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center mb-3">
          {renderStars(rating)}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            <span className="text-sm text-gray-600 ml-1">{t('tourCard.perPerson')}</span>
          </div>
          
          <button
            className={`px-4 py-2 bg-${highlightColor}-600 text-white rounded-md hover:bg-${highlightColor}-700 transition-colors focus:outline-none focus:ring-2 focus:ring-${highlightColor}-500 focus:ring-offset-2`}
            onClick={(e) => {
              e.stopPropagation();
              if (onButtonClick) {
                onButtonClick();
              }
            }}
          >
            {buttonText || t('tourCard.bookNow')}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`${title} tour in ${location}, ${duration}, ${formatPrice(price)} per person`}
    >
      {linkTo ? (
        <Link to={linkTo} className="block h-full">
          {CardContent}
        </Link>
      ) : (
        CardContent
      )}
    </div>
  );
};

export default TourCard;
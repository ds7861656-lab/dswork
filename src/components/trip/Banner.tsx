// src/components/trip/Banner.tsx
// ✅ FINAL VERSION: Display Quotefancy image only - clean background image

import React, { useState } from 'react';

interface BannerProps {
  className?: string;
  alt?: string;
  onClick?: () => void;
  showLoadingEffect?: boolean;
}

const Banner: React.FC<BannerProps> = ({
  className = '',
  alt = 'Trip Banner',
  onClick,
  showLoadingEffect = true
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    console.log('✅ Banner image loaded successfully');
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('❌ Failed to load banner image');
    console.error('Expected path: /assets/Quotefancy-19979-3840x2160.jpg');
    setImageError(true);
  };

  return (
    <div 
      className={`
        relative w-full h-48 md:h-56 lg:h-64 rounded-xl overflow-hidden 
        shadow-lg bg-gray-200 group
        ${onClick ? 'cursor-pointer' : ''}
        transition-transform duration-300 ${onClick ? 'hover:scale-105' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Main Banner Image - Full background, no text */}
      {!imageError && (
        <>
          <img
            src="/assets/temporarybanner.jpg" // Placeholder image while loading
            alt={alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`
              w-full h-full object-cover
              transition-opacity duration-500 ease-in-out
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {/* Loading skeleton while image loads */}
          {showLoadingEffect && !imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse" />
          )}
        </>
      )}

      {/* Error fallback - if image doesn't load */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-teal-600">
          <div className="text-center text-white px-4">
            <p className="text-sm font-bold">Image not found</p>
            <p className="text-xs opacity-80 mt-1">
              Place Quotefancy-19979-3840x2160.jpg in public/assets/
            </p>
          </div>
        </div>
      )}

      {/* Subtle hover effect overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
    </div>
  );
};

export default Banner;
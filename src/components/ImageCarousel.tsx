import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageCarouselProps {
  images: string[];
  altPrefix: string;
  onImageClick?: (image: string, index: number) => void;
  autoplay?: boolean;
  autoplayInterval?: number;
  showThumbnails?: boolean;
  showFullscreenButton?: boolean;
  lazyLoad?: boolean;
  className?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  showImageCounter?: boolean;
  showDots?: boolean;
  showArrows?: boolean;
  transitionDuration?: number;
  enableSwipe?: boolean;
  enableKeyboardNavigation?: boolean;
  responsiveImages?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  altPrefix,
  onImageClick,
  autoplay = false,
  autoplayInterval = 5000,
  showThumbnails = false,
  showFullscreenButton = true,
  lazyLoad = true,
  className = '',
  height = 'h-96',
  objectFit = 'cover',
  showImageCounter = true,
  showDots = true,
  showArrows = true,
  transitionDuration = 300,
  enableSwipe = true,
  enableKeyboardNavigation = true,
  responsiveImages = true,
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);


  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, images.length, transitionDuration]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, images.length, transitionDuration]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [isTransitioning, currentIndex, transitionDuration]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Preload next and previous images
  useEffect(() => {
    if (!lazyLoad || images.length <= 1) return;

    const preloadIndices = [
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
    ];

    preloadIndices.forEach((index) => {
      if (!loadedImages.has(index) && !errorImages.has(index)) {
        const img = new Image();
        img.src = images[index];
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(index));
        };
        img.onerror = () => {
          setErrorImages((prev) => new Set(prev).add(index));
        };
      }
    });
  }, [currentIndex, images, lazyLoad, loadedImages, errorImages]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && !isPaused && images.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, autoplayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, autoplayInterval, isPaused, images.length, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNavigation, isFullscreen, goToPrevious, goToNext, toggleFullscreen]);


  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enableSwipe) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!enableSwipe || !touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(images[currentIndex], currentIndex);
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const handleImageError = (index: number) => {
    setErrorImages((prev) => new Set(prev).add(index));
  };

  // Generate responsive image attributes
  const getResponsiveImageProps = (src: string) => {
    if (!responsiveImages) return { src };

    // For now, assume the backend provides different sizes
    // In production, you'd have multiple sizes like image_400w.jpg, image_800w.jpg, etc.
    // This is a basic implementation - in reality, you'd need backend support for multiple sizes
    return {
      src,
      srcSet: `${src} 1x`,
      sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    };
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image */}
        <div className={`${height} relative`}>
          {errorImages.has(currentIndex) ? (
            <div className={`w-full ${height} bg-gray-200 flex items-center justify-center`}>
              <div className="text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-gray-500">{t('imageCarousel.imageLoadError')}</p>
              </div>
            </div>
          ) : (
            <img
              {...getResponsiveImageProps(images[currentIndex])}
              alt={`${altPrefix} - Image ${currentIndex + 1}`}
              className={`w-full ${height} object-${objectFit} cursor-pointer transition-opacity ${isTransitioning ? 'opacity-90' : 'opacity-100'}`}
              style={{ transitionDuration: `${transitionDuration}ms` }}
              onClick={handleImageClick}
              onLoad={() => handleImageLoad(currentIndex)}
              onError={() => handleImageError(currentIndex)}
              loading={lazyLoad ? 'lazy' : 'eager'}
            />
          )}
          
          {/* Loading Indicator */}
          {!loadedImages.has(currentIndex) && !errorImages.has(currentIndex) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {showArrows && images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={t('imageCarousel.previousImage')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={t('imageCarousel.nextImage')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {showImageCounter && images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Fullscreen Button */}
        {showFullscreenButton && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isFullscreen ? t('imageCarousel.exitFullscreen') : t('imageCarousel.enterFullscreen')}
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                index === currentIndex
                  ? 'bg-teal-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`${t('imageCarousel.goToImage')} ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Navigation */}
      {showThumbnails && images.length > 1 && (
        <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`shrink-0 w-20 h-20 rounded overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                index === currentIndex
                  ? 'ring-2 ring-teal-600'
                  : 'opacity-70 hover:opacity-100'
              }`}
              aria-label={`${t('imageCarousel.goToImage')} ${index + 1}`}
            >
              <img
                src={image}
                alt={`${altPrefix} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full">
            <img
              src={images[currentIndex]}
              alt={`${altPrefix} - Fullscreen Image ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {/* Fullscreen Navigation Arrows */}
            {showArrows && images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label={t('imageCarousel.previousImage')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label={t('imageCarousel.nextImage')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Fullscreen Close Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={t('imageCarousel.closeFullscreen')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Fullscreen Image Counter */}
            {showImageCounter && images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
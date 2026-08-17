import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Tour {
  id: string;
  image: string;
  title: string;
  description: string;
  price?: number;
  duration?: string;
  rating?: number;
}

interface CountryCardProps {
  country: string;
  countrySlug: string;
  description: string;
  tours: Tour[];
  onViewAll?: (country: string) => void;
  onTourClick?: (tourId: string) => void;
  loading?: boolean;
}

const CountryCard: React.FC<CountryCardProps> = ({
  country,
  countrySlug,
  description,
  tours,
  onViewAll,
  onTourClick,
  loading = false,
}) => {
  const [hoveredTourId, setHoveredTourId] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll(countrySlug);
    }
  };

  const handleTourClick = (tourId: string) => {
    if (onTourClick) {
      onTourClick(tourId);
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
      </div>
    );
  };

  if (loading) {
    return (
      <div className="country-card container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="country-card container mx-auto px-4 py-8" aria-labelledby={`country-${countrySlug}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 id={`country-${countrySlug}`} className="text-3xl font-bold text-gray-800">{country}</h2>
          <button
            onClick={handleViewAll}
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-3 py-1"
            aria-label={`View all tours in ${country}`}
          >
            {t('countryCard.viewAll')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <p className="text-gray-700 leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-sm text-gray-500">{t('countryCard.featuredTours')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tours.map((tour) => (
          <article
            key={tour.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onMouseEnter={() => setHoveredTourId(tour.id)}
            onMouseLeave={() => setHoveredTourId(null)}
            onClick={() => handleTourClick(tour.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleTourClick(tour.id)}
            aria-label={`View details for ${tour.title} tour in ${country}`}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={tour.image}
                alt={`${tour.title} - ${country}`}
                className="w-full h-full object-cover transition-transform duration-500"
                style={{ transform: hoveredTourId === tour.id ? 'scale(1.05)' : 'scale(1)' }}
                loading="lazy"
              />
              {tour.price && (
                <div className="absolute top-0 right-0 bg-teal-600 text-white px-3 py-1 rounded-bl-lg font-semibold">
                  ${tour.price}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{tour.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                {tour.duration && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tour.duration}
                  </div>
                )}
                {tour.rating && (
                  <div className="flex items-center">
                    {renderStars(tour.rating)}
                    <span className="ml-1 text-sm text-gray-500">({tour.rating})</span>
                  </div>
                )}
              </div>
              
              <button
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTourClick(tour.id);
                }}
                aria-label={`Discover ${tour.title} in ${country}`}
              >
                {t('countryCard.discover')}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleViewAll}
          className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 font-medium"
          aria-label={`View all tours in ${country}`}
        >
          {t('countryCard.viewAllTours', { country })}
        </button>
      </div>
    </section>
  );
};

export default CountryCard;
// src/pages/CarRentals.tsx
// ✅ UPDATED: Sticky sidebar filters on desktop, collapsible on mobile

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FunnelIcon, AdjustmentsHorizontalIcon, XMarkIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CarSearchBar from '../components/trip/CarSearchBar';
import CarCard from '../components/trip/CarCard';
import Pagination from '../components/Pagination';
import BecomeHostModal from '../components/trip/BecomeHostModal';
import { mockCars, filterCars, sortCars } from '../data/mockCars';
import { type Car, type CarFilters } from '../types/car';

const CarRentals: React.FC = () => {
  const { t } = useTranslation();
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(mockCars);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<CarFilters>({
    type: [],
    transmission: [],
    seats: [],
    priceRange: [0, 300],
    fuelType: [],
    rating: 0
  });

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  // Apply filters and sort
  useEffect(() => {
    let result = filterCars(cars, filters);
    result = sortCars(result, sortBy);
    setFilteredCars(result);
    setCurrentPage(1);
  }, [filters, sortBy, cars]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleFilterChange = (filterType: keyof CarFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleToggleType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type?.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...(prev.type || []), type]
    }));
  };

  const handleToggleTransmission = (transmission: string) => {
    setFilters(prev => ({
      ...prev,
      transmission: prev.transmission?.includes(transmission)
        ? prev.transmission.filter(t => t !== transmission)
        : [...(prev.transmission || []), transmission]
    }));
  };

  const handleToggleFavorite = (carId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(carId)) {
        newFavorites.delete(carId);
      } else {
        newFavorites.add(carId);
      }
      return newFavorites;
    });
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      transmission: [],
      seats: [],
      priceRange: [0, 300],
      fuelType: [],
      rating: 0
    });
  };

  const activeFilterCount = 
    (filters.type?.length || 0) +
    (filters.transmission?.length || 0) +
    (filters.seats?.length || 0) +
    (filters.rating ? 1 : 0);

  // Filter Section Component (Reusable)
  const FilterSection = () => (
    <>
      {/* Car Type */}
      <div className="pb-6 border-b border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          {t('trips.carType') || 'Car Type'}
        </label>
        <div className="space-y-2">
          {['SUV', 'Sedan', 'Van', 'Electric', 'Luxury'].map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.type?.includes(type)}
                onChange={() => handleToggleType(type)}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="pb-6 border-b border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          {t('trips.transmission') || 'Transmission'}
        </label>
        <div className="space-y-2">
          {['Automatic', 'Manual'].map(trans => (
            <label key={trans} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.transmission?.includes(trans)}
                onChange={() => handleToggleTransmission(trans)}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{trans}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pb-6 border-b border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          {t('trips.priceRange') || 'Price Range'}
        </label>
        <div className="text-sm text-gray-600 mb-3">
          ${filters.priceRange?.[0]} - ${filters.priceRange?.[1]}
        </div>
        <input
          type="range"
          min="0"
          max="300"
          value={filters.priceRange?.[1] || 300}
          onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$0</span>
          <span>$300+</span>
        </div>
      </div>

      {/* Seats */}
      <div className="pb-6 border-b border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          {t('trips.seats') || 'Number of Seats'}
        </label>
        <div className="flex gap-2 flex-wrap">
          {[4, 5, 7].map(seats => (
            <button
              key={seats}
              onClick={() => {
                const current = filters.seats || [];
                handleFilterChange(
                  'seats',
                  current.includes(seats)
                    ? current.filter(s => s !== seats)
                    : [...current, seats]
                );
              }}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                filters.seats?.includes(seats)
                  ? 'border-teal-600 bg-teal-50 text-teal-600 font-semibold'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {seats}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pb-6">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          {t('trips.minRating') || 'Minimum Rating'}
        </label>
        <select
          value={filters.rating || 0}
          onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="0">{t('trips.anyRating') || 'Any'}</option>
          <option value="4.0">4.0+</option>
          <option value="4.5">4.5+</option>
          <option value="4.8">4.8+</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Search Bar Section */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <CarSearchBar compact={true} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Become a Host Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('trips.availableCars') || 'Available Cars'}
            </h1>
            <p className="text-gray-600">
              {filteredCars.length} {t('trips.carsAvailable') || 'cars available'}
            </p>
          </div>
          
          {/* ✅ Become a Host Button */}
          <button
            onClick={() => setShowHostModal(true)}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <PlusCircleIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            {t('trips.becomeHost') || 'Become a Host'}
          </button>
        </div>

        {/* Mobile Filter Button & Sort */}
        <div className="flex lg:hidden flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:border-gray-400 transition-colors"
          >
            <FunnelIcon className="w-5 h-5" />
            <span className="font-medium">
              {t('trips.filters') || 'Filters'}
            </span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-teal-600 text-white text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            >
              <option value="popular">{t('trips.sortPopular') || 'Most Popular'}</option>
              <option value="price-asc">{t('trips.sortPriceLow') || 'Price: Low to High'}</option>
              <option value="price-desc">{t('trips.sortPriceHigh') || 'Price: High to Low'}</option>
              <option value="rating">{t('trips.sortRating') || 'Highest Rated'}</option>
            </select>
          </div>
        </div>

        {/* Mobile Filters Panel (Full Screen Modal) */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('trips.filters') || 'Filters'}</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <FilterSection />
              
              <div className="sticky bottom-0 bg-white border-t border-gray-200 pt-4 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  {t('trips.clearAll') || 'Clear all'}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold"
                >
                  {t('trips.showResults') || 'Show results'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Layout with Sticky Sidebar */}
        <div className="flex gap-8">
          {/* ✅ Sticky Sidebar Filters (Desktop Only) */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-32 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {t('trips.filterBy') || 'Filters'}
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 underline"
                  >
                    {t('trips.clearAll') || 'Clear all'}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <FilterSection />
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Desktop Sort Bar */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                {filteredCars.length} {t('trips.carsAvailable') || 'cars available'}
              </div>
              <div className="flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="popular">{t('trips.sortPopular') || 'Most Popular'}</option>
                  <option value="price-asc">{t('trips.sortPriceLow') || 'Price: Low to High'}</option>
                  <option value="price-desc">{t('trips.sortPriceHigh') || 'Price: High to Low'}</option>
                  <option value="rating">{t('trips.sortRating') || 'Highest Rated'}</option>
                </select>
              </div>
            </div>

            {/* No Results */}
            {filteredCars.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('trips.noResults') || 'No cars found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('trips.tryAdjusting') || 'Try adjusting your filters or search criteria'}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold"
                >
                  {t('trips.clearFilters') || 'Clear Filters'}
                </button>
              </div>
            )}

            {/* Cars Grid */}
            {filteredCars.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentCars.map(car => (
                    <CarCard
                      key={car.id}
                      car={car}
                      isFavorite={favorites.has(car.id)}
                      onFavoriteToggle={handleToggleFavorite}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredCars.length}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* ✅ Become a Host Modal */}
      <BecomeHostModal
        isOpen={showHostModal}
        onClose={() => setShowHostModal(false)}
      />

      <Footer />
    </div>
  );
};

export default CarRentals;

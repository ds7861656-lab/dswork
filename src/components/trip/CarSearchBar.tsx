// src/components/car-rental/CarSearchBar.tsx

import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface CarSearchBarProps {
  onSearch?: (params: SearchParams) => void;
  compact?: boolean;
}

interface SearchParams {
  location: string;
  pickupDate: string;
  dropoffDate: string;
  pickupTime: string;
  dropoffTime: string;
}

const CarSearchBar: React.FC<CarSearchBarProps> = ({ onSearch, compact = false }) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffTime, setDropoffTime] = useState('10:00');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        location,
        pickupDate,
        dropoffDate,
        pickupTime,
        dropoffTime
      });
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-full shadow-lg border border-gray-200 px-6 py-3 flex items-center gap-4 hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-2 flex-1">
          <MapPinIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('trips.searchLocation') || 'Search location'}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex items-center gap-2 flex-1">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-gray-800 focus:outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full transition-colors"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Location */}
        <div
          className={`p-4 md:p-6 cursor-pointer transition-all ${
            focusedField === 'location' ? 'bg-gray-50 ring-2 ring-teal-500 ring-inset' : 'hover:bg-gray-50'
          }`}
          onClick={() => setFocusedField('location')}
        >
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {t('carRental.location') || 'Location'}
          </label>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder={t('carRental.whereGoing') || 'Where are you going?'}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setFocusedField('location')}
              onBlur={() => setFocusedField(null)}
              className="w-full bg-transparent text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Pickup Date */}
        <div
          className={`p-4 md:p-6 cursor-pointer transition-all ${
            focusedField === 'pickupDate' ? 'bg-gray-50 ring-2 ring-teal-500 ring-inset' : 'hover:bg-gray-50'
          }`}
          onClick={() => setFocusedField('pickupDate')}
        >
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {t('carRental.pickupDate') || 'Pickup Date'}
          </label>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              onFocus={() => setFocusedField('pickupDate')}
              onBlur={() => setFocusedField(null)}
              className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Dropoff Date */}
        <div
          className={`p-4 md:p-6 cursor-pointer transition-all ${
            focusedField === 'dropoffDate' ? 'bg-gray-50 ring-2 ring-teal-500 ring-inset' : 'hover:bg-gray-50'
          }`}
          onClick={() => setFocusedField('dropoffDate')}
        >
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {t('carRental.dropoffDate') || 'Dropoff Date'}
          </label>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="date"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              onFocus={() => setFocusedField('dropoffDate')}
              onBlur={() => setFocusedField(null)}
              className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Pickup Time */}
        <div
          className={`p-4 md:p-6 cursor-pointer transition-all ${
            focusedField === 'pickupTime' ? 'bg-gray-50 ring-2 ring-teal-500 ring-inset' : 'hover:bg-gray-50'
          }`}
          onClick={() => setFocusedField('pickupTime')}
        >
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {t('carRental.pickupTime') || 'Pickup Time'}
          </label>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              onFocus={() => setFocusedField('pickupTime')}
              onBlur={() => setFocusedField(null)}
              className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Dropoff Time */}
        <div
          className={`p-4 md:p-6 cursor-pointer transition-all ${
            focusedField === 'dropoffTime' ? 'bg-gray-50 ring-2 ring-teal-500 ring-inset' : 'hover:bg-gray-50'
          }`}
          onClick={() => setFocusedField('dropoffTime')}
        >
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {t('carRental.dropoffTime') || 'Dropoff Time'}
          </label>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              onFocus={() => setFocusedField('dropoffTime')}
              onBlur={() => setFocusedField(null)}
              className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleSearch}
          disabled={!location || !pickupDate || !dropoffDate}
          className="w-full md:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          {t('carRental.searchCars') || 'Search Cars'}
        </button>
      </div>
    </div>
  );
};

export default CarSearchBar;

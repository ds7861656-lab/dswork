// src/components/trip/TripSummary.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChartBarIcon, UsersIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useTripStore } from '../../stores/tripStore';

const TripSummary: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentTrip } = useTripStore();

  const getLocale = () => {
    switch (i18n.language) {
      case 'fr': return 'fr-FR';
      case 'es': return 'es-ES';
      case 'zh': return 'zh-CN';
      default: return 'en-US';
    }
  };

  if (!currentTrip) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Trip Summary</h3>
        <p className="text-gray-500 text-sm">No trip data available</p>
      </div>
    );
  }

  const { settings, places, createdAt } = currentTrip;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl smooth-transition">
      <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
        <div className="w-11 h-11 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-purple-500/30">
          <ChartBarIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Trip Overview</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your journey at a glance</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="group flex items-center justify-between py-3.5 px-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 smooth-transition hover:shadow-md">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-gray-700 font-semibold">Duration</span>
          </div>
          <span className="text-base font-bold text-blue-700">{settings.duration} days</span>
        </div>

        <div className="group flex items-center justify-between py-3.5 px-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100 hover:border-green-300 smooth-transition hover:shadow-md">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <UsersIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-gray-700 font-semibold">{t('trips.travelers')}</span>
          </div>
          <span className="text-base font-bold text-green-700">{settings.travelers} {settings.travelers === 1 ? 'person' : 'people'}</span>
        </div>

        <div className="group flex items-center justify-between py-3.5 px-4 bg-linear-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-100 hover:border-yellow-300 smooth-transition hover:shadow-md">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-yellow-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <CurrencyDollarIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm text-gray-700 font-semibold">Budget</span>
          </div>
          <span className="text-base font-bold text-yellow-700">${settings.budget.toLocaleString()}</span>
        </div>

        <div className="group flex items-center justify-between py-3.5 px-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100 hover:border-purple-300 smooth-transition hover:shadow-md">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-purple-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm text-gray-700 font-semibold">Places to Visit</span>
          </div>
          <span className="text-base font-bold text-purple-700">{places.length}</span>
        </div>

        <div className="group flex items-center justify-between py-3.5 px-4 bg-linear-to-r from-teal-50 to-blue-50 rounded-2xl border-2 border-teal-100 hover:border-teal-300 smooth-transition hover:shadow-md">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-sm text-gray-700 font-semibold">Destination</span>
          </div>
          <span className="text-base font-bold text-teal-700 truncate ml-2 max-w-[140px]" title={settings.destination}>{settings.destination}</span>
        </div>

        <div className="pt-4 mt-4 border-t-2 border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">
              Created on {new Date(createdAt).toLocaleDateString(getLocale(), { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
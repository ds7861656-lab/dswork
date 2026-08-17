// src/components/trip/TripGenerationPanel.tsx
// ✅ Shows generated trip details with stops list and Start Navigation button

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPinIcon,
  ClockIcon,
  ArrowPathIcon,
  PlayIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import type { RouteInfo, TripStop } from '../../types/trip';

interface TripGenerationPanelProps {
  routeInfo: RouteInfo;
  stops: TripStop[];
  onStartNavigation: () => void;
  onResetTrip: () => void;
  transport: 'car' | 'bike';
}

const TripGenerationPanel: React.FC<TripGenerationPanelProps> = ({
  routeInfo,
  stops,
  onStartNavigation,
  onResetTrip,
  transport
}) => {
  const { t } = useTranslation();

  const formatDuration = () => {
    const hours = Math.floor(routeInfo.duration / 60);
    const minutes = routeInfo.duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <div className="px-6 py-6 space-y-6">
      
      {/* Route Summary Card */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4">{t('trips.routeSummary') || 'Route Summary'}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-100 text-sm mb-1">
              <MapPinIcon className="w-4 h-4" />
              <span>{t('trips.distance') || 'Distance'}</span>
            </div>
            <div className="text-2xl font-bold">{routeInfo.distanceText}</div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 text-teal-100 text-sm mb-1">
              <ClockIcon className="w-4 h-4" />
              <span>{t('trips.drivingTime') || 'Driving Time'}</span>
            </div>
            <div className="text-2xl font-bold">{formatDuration()}</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-teal-400/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-teal-100">{t('trips.transportMode') || 'Transport'}</span>
            <span className="font-semibold">
              {transport === 'car' ? '🚗 ' + (t('trips.car') || 'Car') : '🚴 ' + (t('trips.bike') || 'Bike')}
            </span>
          </div>
        </div>
      </div>

      {/* Trip Generation Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-teal-600" />
          {t('trips.suggestedStops') || 'Suggested Stops Along Route'}
        </h3>

        {stops.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{t('trips.noStopsFound') || 'No interesting places found along this route'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stops.map((stop, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-teal-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Stop Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Stop Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">{stop.name}</h4>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium">
                        {stop.type}
                      </span>
                      {stop.rating && (
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{stop.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {/* Start Navigation Button */}
        <button
          onClick={onStartNavigation}
          className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 flex items-center justify-center gap-2"
        >
          <PlayIcon className="w-5 h-5" />
          {t('trips.startNavigation') || 'Start Navigation'}
        </button>

        {/* Reset Trip Button */}
        <button
          onClick={onResetTrip}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          {t('trips.planNewTrip') || 'Plan New Trip'}
        </button>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm">
          💡 {t('trips.travelTips') || 'Travel Tips'}
        </h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• {t('trips.tip1') || 'Check opening hours before visiting'}</li>
          <li>• {t('trips.tip2') || 'Allow extra time for photo stops'}</li>
          <li>• {t('trips.tip3') || 'Download offline maps for better navigation'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TripGenerationPanel;

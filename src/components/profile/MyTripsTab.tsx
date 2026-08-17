// src/components/profile/MyTripsTab.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Trip {
  id: string;
  destination: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  duration: string;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const MyTripsTab: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const myTrips: Trip[] = [
    {
      id: '1',
      destination: 'Paris',
      city: 'Paris',
      country: 'France',
      startDate: '2025-03-15',
      endDate: '2025-03-22',
      duration: '7 days',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
      status: 'upcoming'
    },
    {
      id: '2',
      destination: 'Lyon',
      city: 'Lyon',
      country: 'France',
      startDate: '2025-04-10',
      endDate: '2025-04-15',
      duration: '5 days',
      image: 'https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=400',
      status: 'upcoming'
    },
    {
      id: '3',
      destination: 'Tokyo',
      city: 'Tokyo',
      country: 'Japan',
      startDate: '2024-12-01',
      endDate: '2024-12-10',
      duration: '9 days',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      status: 'completed'
    }
  ];

  const getStatusBadge = (status: Trip['status']) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700'
    };

    const labels = {
      upcoming: t('trips.upcoming') || 'Upcoming',
      ongoing: t('trips.ongoing') || 'Ongoing',
      completed: t('trips.completed') || 'Completed'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('trips.myTrips') || 'My Trips'}
          </h2>
          <p className="text-gray-600 mt-1">
            {t('trips.myTripsDesc') || 'View and manage your travel plans'}
          </p>
        </div>
        <button
          onClick={() => navigate('/trips/new')}
          className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold flex items-center gap-2"
        >
          {t('trips.planNew') || 'Plan New Trip'}
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {myTrips.length === 0 ? (
        <div className="text-center py-16">
          <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('trips.noTrips') || 'No trips planned yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('trips.noTripsDesc') || 'Start planning your next adventure!'}
          </p>
          <button
            onClick={() => navigate('/trips/new')}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold"
          >
            {t('trips.planFirst') || 'Plan Your First Trip'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/trips/${trip.id}`)}
            >
              {/* Trip Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.destination}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(trip.status)}
                </div>
              </div>

              {/* Trip Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-teal-600" />
                  {trip.destination}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {trip.city}, {trip.country}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span>{trip.duration}</span>
                  </div>
                </div>

                <button
                  className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-colors font-medium flex items-center justify-center gap-2 group"
                >
                  {t('trips.viewDetails') || 'View Details'}
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTripsTab;

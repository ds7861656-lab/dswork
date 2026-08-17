import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusIcon, MagnifyingGlassIcon, CalendarIcon, CreditCardIcon } from '@heroicons/react/24/outline';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureGate from '../components/FeatureGate';
import { FeatureId } from '../types/features';
import EmptyState from '../components/ui/EmptyState';

// New Modular Components
import PassportHeader from '../components/trip/PassportHeader';
import TripControls, { type TripTab, type ViewMode } from '../components/trip/TripControls';

// Hooks & Types
import { useAuth } from '../contexts/AuthContext';

const TripsContent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- State ---
  const [activeTab, setActiveTab] = useState<TripTab>('upcoming');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  // Mock data for demonstration
  const mockTrips = [
    {
      id: '1',
      destination: 'Paris, France',
      startDate: '2026-04-15',
      endDate: '2026-04-22',
      status: 'upcoming',
      places: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
    },
    {
      id: '2',
      destination: 'Tokyo, Japan',
      startDate: '2026-06-10',
      endDate: '2026-06-20',
      status: 'upcoming',
      places: ['Shibuya', 'Senso-ji Temple', 'Mt. Fuji'],
    },
    {
      id: '3',
      destination: 'New York, USA',
      startDate: '2025-12-01',
      endDate: '2025-12-10',
      status: 'past',
      places: ['Statue of Liberty', 'Central Park', 'Times Square'],
    },
  ];

  // Filter trips based on active tab
  const filteredTrips = useMemo(() => {
    return mockTrips.filter(trip => {
      // Tab filter
      const now = new Date();
      const startDate = new Date(trip.startDate);
      
      if (activeTab === 'upcoming' && startDate < now) return false;
      if (activeTab === 'past' && startDate >= now) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!trip.destination.toLowerCase().includes(query)) return false;
      }
      
      // Year filter
      if (selectedYear !== 'all') {
        const tripYear = startDate.getFullYear();
        if (tripYear !== selectedYear) return false;
      }
      
      return true;
    });
  }, [mockTrips, activeTab, searchQuery, selectedYear]);

  const handleCreateTrip = () => {
    navigate('/');
  };

  // ✅ NEW: Handle update subscription
  const handleUpdateSubscription = () => {
    navigate('/pricing');
  };

  // --- Render ---
  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Trip Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('trips.upcoming', 'Upcoming')}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'past'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('trips.past', 'Past')}
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('trips.all', 'All')}
            </button>
          </div>

          {/* ✅ Action Buttons */}
          <div className="flex gap-3">
            {/* Update Subscription Button */}
            <button
              onClick={handleUpdateSubscription}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              <CreditCardIcon className="w-5 h-5" />
              <span className="font-medium">{t('trips.updateSubscription', 'Update Subscription')}</span>
            </button>

            {/* Create Trip Button */}
            <button
              onClick={handleCreateTrip}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-md"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="font-medium">{t('trips.createTrip', 'Create Trip')}</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t('trips.searchPlaceholder', 'Search trips...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Trip Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => navigate(`/trip/${trip.id}`)}
            >
              {/* Trip Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-teal-400 to-blue-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold drop-shadow-lg">
                    {trip.destination}
                  </h3>
                </div>
              </div>

              {/* Trip Details */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-slate-600 mb-3">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {trip.places.length} {t('trips.places', 'places')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'upcoming'
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {trip.status === 'upcoming' ? t('trips.upcoming', 'Upcoming') : t('trips.completed', 'Completed')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={t('trips.noTripsFound', 'No trips found')}
          description={t('trips.noTripsDescription', 'Try adjusting your filters or create a new trip')}
          actionLabel={t('trips.createTrip', 'Create Trip')}
          onAction={handleCreateTrip}
        />
      )}
    </div>
  );
};

const Trips: React.FC = () => {
  const { user } = useAuth();

  const mockStats = {
    total: 3,
    upcoming: 2,
    countries: 3
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* 1. Header is always visible */}
        <PassportHeader user={user || null} stats={mockStats} />

        {/* 2. Feature Gate wraps the content */}
        <FeatureGate
          feature={FeatureId.BASIC_TRIP_PLANNING}
          restrictMode="blur"
          fallback={null}
        >
          <TripsContent />
        </FeatureGate>
      </main>

      <Footer />
    </div>
  );
};

export default Trips;
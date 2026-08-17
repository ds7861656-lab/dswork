import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPinIcon, CalendarIcon, CloudIcon, SunIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

interface ActiveTripHeroProps {
  trip: {
    id: string;
    destination: string;
    startDate: string;
    endDate: string;
    weather?: {
      current?: {
        temperature: number;
        condition: string;
      };
    };
  };
}

const ActiveTripHero: React.FC<ActiveTripHeroProps> = ({ trip }) => {
  const { t } = useTranslation();
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [totalDays, setTotalDays] = useState<number>(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate "Day X of Y"
  useEffect(() => {
    const start = new Date(trip.startDate).getTime();
    const end = new Date(trip.endDate).getTime();
    const now = Date.now();

    const dayDiff = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
    const total = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    setCurrentDay(Math.max(1, dayDiff));
    setTotalDays(Math.max(1, total));
  }, [trip.startDate, trip.endDate]);

  // Dynamic Image based on destination
  const imageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(trip.destination)},travel,landmark`;

  // Progress percentage
  const progressPercent = Math.min(100, Math.max(0, (currentDay / totalDays) * 100));

  return (
    <div className="relative w-full h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl shadow-teal-900/20 mb-12 group transition-all duration-500 hover:shadow-teal-900/30 border border-slate-100/10">
      
      {/* 1. Background Image with Animation */}
      <img
        src={imageUrl}
        alt={trip.destination}
        onLoad={() => setImageLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-110 ${
          imageLoaded ? 'opacity-100' : 'opacity-0 bg-slate-200'
        }`}
      />
      
      {/* 2. Gradient Overlays for Readability */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/80 to-transparent opacity-80" />

      {/* 3. "Live" Pulse Indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full z-10">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          {t('trips.statuses.active', { defaultValue: 'Live Now' })}
        </span>
      </div>

      {/* 4. Main Content Area */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row items-end justify-between gap-6">
        
        {/* Left: Destination Info */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-teal-300 font-medium tracking-wide text-sm uppercase">
            <MapPinIcon className="w-4 h-4" />
            <span>{t('trips.currentLocation', { defaultValue: 'Current Location' })}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
            {trip.destination}
          </h2>

          <div className="flex items-center gap-6 text-slate-300">
            {/* Weather Widget */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
              {trip.weather?.current?.condition?.toLowerCase().includes('rain') ? (
                <CloudIcon className="w-5 h-5 text-blue-300" />
              ) : (
                <SunIcon className="w-5 h-5 text-amber-300" />
              )}
              <span className="text-white font-semibold">
                {trip.weather?.current?.temperature ? `${trip.weather.current.temperature}°C` : '--°C'}
              </span>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 opacity-70" />
              <span>
                {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                {' - '}
                {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Progress & Action */}
        <div className="w-full md:w-auto flex flex-col items-end gap-6">
          
          {/* Day Counter & Progress Bar */}
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-sm font-medium text-white/90">
              <span>{t('trips.dayCounter', { current: currentDay, total: totalDays, defaultValue: `Day ${currentDay} of ${totalDays}` })}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-linear-to-r from-teal-400 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <Link 
            to={`/trip-planner/${trip.id}`}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-xl hover:bg-teal-50 transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full md:w-auto justify-center"
          >
            <span>{t('trips.viewItinerary', { defaultValue: 'View Today\'s Plan' })}</span>
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/40 to-transparent z-10 pointer-events-none" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActiveTripHero;
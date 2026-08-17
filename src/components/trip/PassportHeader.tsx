import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapIcon,
  PaperAirplaneIcon,
  GlobeAltIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import type { AuthUser } from '../../contexts/AuthContext';

export interface TripStats {
  total: number;
  upcoming: number;
  countries: number; // Distinct destinations
}

interface PassportHeaderProps {
  user: AuthUser | null;
  stats: TripStats;
}

const PassportHeader: React.FC<PassportHeaderProps> = ({ user, stats }) => {
  const { t } = useTranslation();

  const displayName =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    t('trips.traveler', 'Traveler');

  return (
    <div className="relative mb-10">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">

        {/* 1. Identity Section */}
        <div className="flex items-center gap-6">
          {/* Avatar Ring */}
          <div className="relative group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg shadow-teal-500/20">
              <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden relative">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserIcon className="w-10 h-10" />
                  </div>
                )}
              </div>
            </div>
            {/* Status Indicator */}
            <div
              className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"
              title={t('trips.activeTraveler', 'Active Traveler')}
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                {t('trips.helloUser', { name: displayName, defaultValue: `Hello, ${displayName}` })}
              </h1>
              {/* Passport Badge */}
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wide shadow-sm">
                {t('trips.passport', 'PASSPORT')}
              </span>
            </div>
            <p className="text-slate-500 text-lg font-medium">
              {t('trips.readyNext', 'Ready for your next adventure?')}
            </p>
          </div>
        </div>

        {/* 2. Stats Ribbon & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

          {/* Stats Strip */}
          <div className="flex items-center bg-white rounded-2xl shadow-sm border border-slate-200/60 p-1.5 divide-x divide-slate-100">

            <div className="px-5 py-2 flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <GlobeAltIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {t('trips.statPlaces', 'Places')}
                </p>
                <p className="text-lg font-bold text-slate-900">{stats.countries}</p>
              </div>
            </div>

            <div className="px-5 py-2 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <MapIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {t('trips.statTotal', 'Total')}
                </p>
                <p className="text-lg font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>

            <div className="px-5 py-2 flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {t('trips.statNext', 'Next')}
                </p>
                <p className="text-lg font-bold text-slate-900">{stats.upcoming}</p>
              </div>
            </div>
          </div>

          {/* 3. Open Planner Action */}
          <Link
            to="/"
            className="group flex items-center gap-2 pl-4 pr-5 py-3.5 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
              <SparklesIcon className="w-4 h-4 text-yellow-300" />
            </div>
            <span>{t('trips.openPlanner', 'Open Planner')}</span>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default PassportHeader;
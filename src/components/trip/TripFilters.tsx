import React from 'react';
import { useTranslation } from 'react-i18next';

export type TripStatusFilter = 'all' | 'planned' | 'active' | 'completed' | 'cancelled';

interface TripFiltersProps {
  currentStatus: TripStatusFilter;
  onStatusChange: (status: TripStatusFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalTrips?: number;
}

const TripFilters: React.FC<TripFiltersProps> = ({
  currentStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  totalTrips = 0
}) => {
  const { t } = useTranslation();

  const statuses: { id: TripStatusFilter; label: string }[] = [
    { id: 'all', label: t('trips.filterAll', { defaultValue: 'All Trips' }) },
    { id: 'active', label: t('trips.statuses.active', { defaultValue: 'Active' }) },
    { id: 'planned', label: t('trips.statuses.planned', { defaultValue: 'Upcoming' }) },
    { id: 'completed', label: t('trips.statuses.completed', { defaultValue: 'Past' }) },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-2 md:p-1.5 rounded-2xl border border-slate-100 shadow-sm">
      
      {/* 1. Status Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        {statuses.map((status) => {
          const isActive = currentStatus === status.id;
          return (
            <button
              key={status.id}
              onClick={() => onStatusChange(status.id)}
              className={`
                whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-teal-500/20
                ${isActive 
                  ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
                }
              `}
            >
              {status.label}
              {status.id === 'all' && totalTrips > 0 && (
                <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-md ${isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>
                  {totalTrips}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Search & Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-64 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('trips.searchPlaceholder', { defaultValue: 'Search city or date...' })}
            className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripFilters;
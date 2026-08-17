import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export type TripTab = 'upcoming' | 'past' | 'all';
export type ViewMode = 'grid' | 'list';

interface TripControlsProps {
  activeTab: TripTab;
  onTabChange: (tab: TripTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  years?: number[]; // Available years for filtering
  selectedYear?: number | 'all';
  onYearChange?: (year: number | 'all') => void;
}

const TripControls: React.FC<TripControlsProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewChange,
  years = [],
  selectedYear = 'all',
  onYearChange
}) => {
  const { t } = useTranslation();

  return (
    <div className="sticky top-[72px] z-30 mb-8 transition-all duration-300">
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-lg shadow-slate-200/20 rounded-2xl p-2 md:p-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* 1. Search Bar */}
          <div className="relative w-full md:w-72 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('trips.searchPlaceholder', { defaultValue: 'Search destination...' })}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border-0 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:bg-white rounded-xl transition-all font-medium sm:text-sm"
            />
          </div>

          {/* 2. Segmented Tabs (Center) */}
          <div className="flex p-1 space-x-1 bg-slate-100/80 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'upcoming', label: t('trips.tabs.upcoming', { defaultValue: 'Upcoming' }) },
              { id: 'past', label: t('trips.tabs.past', { defaultValue: 'Journals' }) },
              { id: 'all', label: t('trips.tabs.all', { defaultValue: 'All Trips' }) },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as TripTab)}
                className={`
                  flex-1 md:flex-none px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 3. Right Actions (Filters & View Toggle) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            
            {/* Year Filter (Only shows for Past/All tabs) */}
            {(activeTab !== 'upcoming' && years.length > 0) && (
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => onYearChange?.(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <option value="all">{t('trips.years.all', { defaultValue: 'All Years' })}</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            )}

            <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block" />

            {/* View Toggles */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => onViewChange('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                aria-label="Grid View"
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-teal-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                aria-label="List View"
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripControls;
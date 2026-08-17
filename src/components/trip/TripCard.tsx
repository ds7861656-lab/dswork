import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CalendarIcon, 
  EllipsisHorizontalIcon, 
  PencilIcon, 
  ShareIcon, 
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import type { ViewMode } from './TripControls';

export interface TripCardProps {
  trip: {
    id: string;
    date: string; // Start date
    endDate?: string;
    city: string;
    stops: number;
    status: string;
  };
  viewMode?: ViewMode;
  onShare?: (id: string) => void;
  onRename?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ 
  trip, 
  viewMode = 'grid',
  onShare, 
  onRename, 
  onDelete 
}) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Helpers ---

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getDaysUntil = (dateString: string) => {
    const diff = new Date(dateString).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return null;
    if (days === 0) return t('trips.today', { defaultValue: 'Today' });
    return t('trips.inDays', { count: days, defaultValue: `In ${days} days` });
  };

  const statusLabel = t(`trips.statuses.${trip.status}`) || trip.status;
  const daysUntil = trip.status === 'planned' ? getDaysUntil(trip.date) : null;
  
  const imageUrl = imageError 
    ? 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    : `https://source.unsplash.com/800x600/?${encodeURIComponent(trip.city)},travel`;

  // --- Components ---

  const StatusBadge = () => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse',
      completed: 'bg-slate-100 text-slate-600 border-slate-200',
      cancelled: 'bg-red-50 text-red-600 border-red-100',
      planned: 'bg-blue-50 text-blue-700 border-blue-100',
    }[trip.status] || 'bg-slate-100 text-slate-600';

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles}`}>
        {statusLabel}
      </span>
    );
  };

  const ActionsMenu = () => (
    <div className="absolute top-3 right-3 z-20" ref={menuRef}>
      <button 
        onClick={(e) => { e.preventDefault(); setIsMenuOpen(!isMenuOpen); }}
        className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 shadow-sm backdrop-blur-sm transition-all"
      >
        <EllipsisHorizontalIcon className="w-6 h-6" />
      </button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 overflow-hidden animate-fade-in-up origin-top-right">
          {onRename && (
            <button onClick={() => { setIsMenuOpen(false); onRename(trip.id); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <PencilIcon className="w-4 h-4" /> {t('common.rename', { defaultValue: 'Rename' })}
            </button>
          )}
          {onShare && (
            <button onClick={() => { setIsMenuOpen(false); onShare(trip.id); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <ShareIcon className="w-4 h-4" /> {t('common.share', { defaultValue: 'Share' })}
            </button>
          )}
          <div className="h-px bg-slate-100 my-1" />
          {onDelete && (
            <button onClick={() => { setIsMenuOpen(false); onDelete(trip.id); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
              <TrashIcon className="w-4 h-4" /> {t('common.delete', { defaultValue: 'Delete' })}
            </button>
          )}
        </div>
      )}
    </div>
  );

  // --- Grid Layout Render ---
  if (viewMode === 'grid') {
    return (
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200/60 overflow-hidden flex flex-col h-full">
        <Link to={`/trip-planner/${trip.id}`} className="absolute inset-0 z-0" aria-label={`View trip to ${trip.city}`} />
        
        {/* Actions (Above Link) */}
        <ActionsMenu />

        {/* Hero Image */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-200">
          <img
            src={imageUrl}
            alt={trip.city}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent opacity-60" />
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
             <div>
               <h3 className="text-xl font-bold text-white shadow-black drop-shadow-md truncate">{trip.city}</h3>
               {daysUntil && (
                 <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300 mt-0.5 shadow-black drop-shadow-sm">
                   <ClockIcon className="w-3.5 h-3.5" />
                   <span>{daysUntil}</span>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4 grow relative z-10 pointer-events-none">
          {/* Metadata Row */}
          <div className="flex items-center justify-between">
            <StatusBadge />
            <div className="text-xs font-medium text-slate-400">
              {formatDate(trip.date)}
            </div>
          </div>

          {/* Visual Route Line */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <div className="w-0.5 h-6 bg-slate-200" />
              <div className="w-2 h-2 rounded-full border-2 border-slate-300 bg-white" />
            </div>
            <div className="space-y-3 w-full">
               <div className="text-sm font-medium text-slate-700">{trip.city}</div>
               <div className="text-xs text-slate-500">{trip.stops} {t('trips.stops', { defaultValue: 'Stops' })}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- List Layout Render ---
  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-slate-200 hover:border-teal-200 hover:shadow-md transition-all p-4 flex items-center gap-6">
       <Link to={`/trip-planner/${trip.id}`} className="absolute inset-0 z-0" aria-label={`View trip to ${trip.city}`} />
       
       {/* Small Thumbnail */}
       <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
          <img src={imageUrl} alt={trip.city} className="w-full h-full object-cover" onError={() => setImageError(true)} />
          {daysUntil && (
             <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-1 font-medium backdrop-blur-sm">
               {daysUntil}
             </div>
          )}
       </div>

       {/* Info */}
       <div className="grow min-w-0 pointer-events-none">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-900 truncate">{trip.city}</h3>
            <StatusBadge />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(trip.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4" />
              <span>{trip.stops} {t('trips.stops')}</span>
            </div>
          </div>
       </div>

       {/* Actions */}
       <div className="relative z-10">
         <ActionsMenu />
       </div>
    </div>
  );
};

export default TripCard;
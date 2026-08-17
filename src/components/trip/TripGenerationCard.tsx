import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from "framer-motion";
import { useTripStore } from '../../stores/tripStore';
import {
  MapPinIcon,
  ClockIcon,
  MapIcon,
  FireIcon,
  ArrowPathIcon,
  SparklesIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import {
  PlayIcon as PlaySolidIcon,
} from '@heroicons/react/24/solid';

// --- Types ---

interface TripGenerationCardProps {
  onGenerateTrip: () => void;
  onStartNavigation: () => void;
}

interface StopItemProps {
  name: string;
  index: number;
  isLast: boolean;
  isActive: boolean;
  onClick: () => void;
  image?: string;
  category?: string;
}

interface SummaryStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
  bgClass: string;
}

// --- Helper Components ---

const SummaryStat: React.FC<SummaryStatProps> = ({ icon, label, value, colorClass, bgClass }) => (
  <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${bgClass}`} />
    
    <div className={`mb-2 p-2 rounded-full ${bgClass} ${colorClass}`}>
      {icon}
    </div>
    <span className="text-lg font-bold text-gray-800 font-serif leading-none mb-1">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</span>
  </div>
);

const StopItem: React.FC<StopItemProps> = ({ name, index, isLast, isActive, onClick, image, category = "Attraction" }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative pl-4 group"
    >
      {/* 1. Timeline Connector Line */}
      {!isLast && (
        <div 
          className="absolute left-[39px] top-12 bottom-0 w-0.5 border-l-2 border-dashed border-gray-200 group-hover:border-teal-200 transition-colors" 
          aria-hidden="true"
        />
      )}

      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 text-left relative z-10
          ${isActive 
            ? 'bg-white border-teal-500 shadow-lg shadow-teal-900/10 scale-[1.02] ring-1 ring-teal-500' 
            : 'bg-white border-gray-100 hover:border-teal-200 hover:shadow-md'
          }
        `}
      >
        {/* Thumbnail & Badge */}
        <div className="relative shrink-0 w-12 h-12 rounded-xl overflow-hidden shadow-sm">
          <img 
            src={image || `https://picsum.photos/100/100?random=${index}`} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className={`
            absolute top-0 left-0 w-5 h-5 flex items-center justify-center rounded-br-lg text-[10px] font-bold text-white
            ${isActive ? 'bg-teal-600' : 'bg-gray-800/80'}
          `}>
            {index + 1}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{category}</span>
            {isActive && <span className="text-[10px] font-bold text-teal-600 flex items-center gap-1">View on Map <MapPinIcon className="w-3 h-3"/></span>}
          </div>
          <h4 className={`text-sm font-bold truncate ${isActive ? 'text-teal-900' : 'text-gray-700'}`}>
            {name}
          </h4>
        </div>

        {/* Arrow Hint */}
        <div className={`text-gray-300 transition-transform duration-300 ${isActive ? 'text-teal-500 translate-x-1' : 'group-hover:translate-x-1'}`}>
          <ChevronRightIcon className="w-5 h-5" />
        </div>
      </button>
      
      {/* Spacer for timeline flow */}
      {!isLast && <div className="h-3" />}
    </motion.div>
  );
};

// --- Main Component ---

const TripGenerationCard: React.FC<TripGenerationCardProps> = ({
  onGenerateTrip,
  onStartNavigation,
}) => {
  const { t } = useTranslation();
  const {
    generatedStops,
    visibleStops,
    selectedStop,
    setSelectedStop,
    tripDetails,
    isGenerating,
    addVisibleStop
  } = useTripStore();

  const [isFullyRevealed, setIsFullyRevealed] = useState(false);

  // Animate stops appearing one by one
  useEffect(() => {
    if (generatedStops.length > 0 && !isFullyRevealed) {
      const timer = setTimeout(() => {
        if (visibleStops.length < generatedStops.length) {
          addVisibleStop(generatedStops[visibleStops.length]);
        } else {
          setIsFullyRevealed(true);
        }
      }, 400); // Slightly slower for more dramatic effect

      return () => clearTimeout(timer);
    }
  }, [generatedStops, visibleStops, isFullyRevealed, addVisibleStop]);

  // Reset when new trip generation starts
  useEffect(() => {
    if (isGenerating) {
      setIsFullyRevealed(false);
    }
  }, [isGenerating]);

  // Loading State
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 bg-white/50 rounded-3xl border border-dashed border-gray-200">
        <div className="relative">
          <div className="absolute inset-0 bg-teal-200 blur-xl opacity-20 rounded-full animate-pulse" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="relative w-16 h-16 mb-6 text-teal-600"
          >
            <SparklesIcon className="w-16 h-16" />
          </motion.div>
        </div>
        <h3 className="text-lg font-serif font-bold text-teal-900 mb-2">Designing Your Trip</h3>
        <p className="text-gray-500 text-sm text-center max-w-xs mb-6">Finding the best routes, hidden gems, and local favorites...</p>
        
        <div className="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-teal-400 to-teal-600 h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  // Empty State
  if (generatedStops.length === 0) return null;

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. Dashboard Stats */}
      {tripDetails && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3"
        >
          <SummaryStat 
            icon={<ClockIcon className="w-5 h-5" />}
            label={t('trips.drivingTime')}
            value={tripDetails.time}
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
          />
          <SummaryStat 
            icon={<MapIcon className="w-5 h-5" />}
            label={t('trips.totalDistance')}
            value={tripDetails.distance}
            colorClass="text-indigo-600"
            bgClass="bg-indigo-50"
          />
          <SummaryStat 
            icon={<FireIcon className="w-5 h-5" />}
            label="Footprint"
            value={tripDetails.co2}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
          />
        </motion.div>
      )}

      {/* 2. Visual Itinerary */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-serif text-lg font-bold text-gray-800">Your Journey</h3>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
            {generatedStops.length} Stops
          </span>
        </div>
        
        <div className="relative">
           {/* Timeline spine background (optional, for visual guide) */}
           <div className="absolute left-[39px] top-4 bottom-4 w-px bg-gray-100 -z-10" />

           <AnimatePresence mode="popLayout">
            {visibleStops.map((stop, index) => (
              <StopItem
                key={stop}
                name={stop}
                index={index}
                isLast={index === generatedStops.length - 1}
                isActive={selectedStop === stop}
                onClick={() => setSelectedStop(selectedStop === stop ? null : stop)}
                // In a real app, you'd pull these from the trip object logic
                category={index === 0 ? "Start Point" : index === generatedStops.length - 1 ? "End Point" : "Attraction"}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Action Footer */}
      {isFullyRevealed && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 pt-2"
        >
          <button
            onClick={onStartNavigation}
            className="w-full py-4 bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-900/20 hover:shadow-teal-900/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <PlaySolidIcon className="w-5 h-5" />
            <span>{t('trips.startNavigation')}</span>
          </button>
          
          <button
            onClick={onGenerateTrip}
            className="w-full py-3 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            {t('trips.regenerateTrip')}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TripGenerationCard;
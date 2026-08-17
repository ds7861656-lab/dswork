// src/components/trip/TripSettingsPanel.tsx
// ✅ UPDATED: Removed input fields, replaced with Banner

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { FaCar, FaBicycle } from 'react-icons/fa';
import TripGenerationCard from './TripGenerationCard';
import TestimonialsGallery from './TestimonialsGallery';
import CarRentalShowcase from './CarRentalShowcase';
import Banner from './Banner';  // ✅ NEW: Banner component
import { useTripStore } from '../../stores/tripStore';

// --- Types ---

interface TripSettingsPanelProps {
  transport: 'car' | 'bike';
  setTransport: (transport: 'car' | 'bike') => void;
  tripType: 'one' | 'return';
  setTripType: (tripType: 'one' | 'return') => void;
  onGenerateTrip: () => void;
  isGenerating: boolean;
  useGoogleMaps: boolean;
}

// --- Helper Components ---

const RadioSelector = ({ 
  selected, 
  onClick, 
  label, 
  icon 
}: { 
  selected: boolean; 
  onClick: () => void; 
  label: string; 
  icon: React.ReactNode 
}) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 group focus:outline-none"
  >
    <div className={`
      w-5 h-5 rounded-full border flex items-center justify-center transition-colors
      ${selected ? 'border-teal-900' : 'border-gray-300 group-hover:border-teal-500'}
    `}>
      {selected && <div className="w-2.5 h-2.5 bg-teal-900 rounded-full" />}
    </div>
    <div className={`text-xl ${selected ? 'text-teal-900' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span className={`text-sm font-medium ${selected ? 'text-teal-900' : 'text-gray-500'}`}>
      {label}
    </span>
  </button>
);

const CheckboxSelector = ({
  checked,
  onClick,
  label
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button onClick={onClick} className="flex items-center gap-2 group">
    <div className={`
      w-4 h-4 rounded flex items-center justify-center transition-colors
      ${checked ? 'bg-teal-900 text-white' : 'bg-gray-200 text-transparent hover:bg-gray-300'}
    `}>
      <CheckCircleSolidIcon className="w-4 h-4" />
    </div>
    <span className={`text-sm font-bold ${checked ? 'text-teal-900' : 'text-gray-500'}`}>
      {label}
    </span>
  </button>
);

// --- Main Component ---

const TripSettingsPanel: React.FC<TripSettingsPanelProps> = ({
  transport,
  setTransport,
  tripType,
  setTripType,
  onGenerateTrip,
  isGenerating,
  useGoogleMaps
}) => {
  const { t } = useTranslation();
  const { generatedStops } = useTripStore();
  
  const hasResult = generatedStops.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#F5F5F7] p-6 pb-20 md:pb-6">
      
      <div className={`transition-all duration-500 ${hasResult ? 'mb-4' : 'mb-8'}`}>
        
        {/* ✅ BANNER SECTION - Replaces input fields */}
        {!hasResult && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <Banner />
          </div>
        )}

        {/* Row 1: Transport & Trip Type */}


        {/* ✅ REMOVED: Row 2: City Inputs (departure & destination) */}

        {/* ✅ REMOVED: Row 3: Interests - This was in TripSettingsPanel but not in your current version */}

        {/* Row 4: Action Button */}
        
      </div>

      {/* --- RESULT SECTION --- */}
      {hasResult ? (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
           <TripGenerationCard 
             onGenerateTrip={onGenerateTrip}
             onStartNavigation={() => {}}
           />
        </div>
      ) : (
        /* Feature Showcase */
        <div className="flex-1">
           <TestimonialsGallery />
           <CarRentalShowcase />
        </div>
      )}

    </div>
  );
};

export default TripSettingsPanel;
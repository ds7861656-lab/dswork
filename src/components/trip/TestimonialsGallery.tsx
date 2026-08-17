import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { FaceSmileIcon } from '@heroicons/react/24/outline';

const TestimonialsGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');

  const { t } = useTranslation();

  const images = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
  ];

  return (
    <div className="mt-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-bold text-gray-800">{t('trips.testimonialsGallery')}</h3>
        <div className="flex bg-gray-100 rounded-full p-0.5">
          <button
            onClick={() => setActiveTab('photo')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
              activeTab === 'photo' ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-400'
            }`}
          >
            {t('trips.photo')}
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
              activeTab === 'video' ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-400'
            }`}
          >
            {t('trips.video')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Main large image with overlay text */}
        <div className="relative rounded-2xl overflow-hidden h-32 group">
          <img src={images[0]} alt="Travel" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/30 p-3 flex flex-col justify-end">
            <p className="text-[10px] text-white font-medium leading-tight mb-1">
              {t('trips.testimonialText')}
            </p>
            <FaceSmileIcon className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Grid of smaller images */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl overflow-hidden h-[60px]">
             <img src={images[1]} alt="Gallery" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-xl overflow-hidden h-[60px]">
             <img src={images[2]} alt="Gallery" className="w-full h-full object-cover" />
          </div>
          <div className="col-span-2 rounded-xl overflow-hidden h-[60px] relative">
             <img src={images[3]} alt="Gallery" className="w-full h-full object-cover" />
             {activeTab === 'video' && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                 <PlayCircleIcon className="w-8 h-8 text-white/90" />
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsGallery;
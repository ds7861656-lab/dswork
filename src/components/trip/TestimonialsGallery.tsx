import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import { FaceSmileIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { mockGalleryItems } from '../../data/mockActivities';

const TestimonialsGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleImageClick = (id: string) => {
    navigate(`/activity/${id}`);
  };

  const mainItem = mockGalleryItems[0];
  const subItems = mockGalleryItems.slice(1);

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
        {mainItem && (
          <div 
            onClick={() => handleImageClick(mainItem.id)}
            className="relative rounded-2xl overflow-hidden h-32 group cursor-pointer"
          >
            <img src={mainItem.imageUrl} alt="Travel" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/30 p-3 flex flex-col justify-end">
              <p className="text-[10px] text-white font-medium leading-tight mb-1">
                {t('trips.testimonialText')}
              </p>
              <FaceSmileIcon className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Grid of smaller images */}
        <div className="grid grid-cols-2 gap-2">
          {subItems.map((item, index) => {
            const isWide = index === 2; // The 3rd item in subItems (which is id: 4) is wide
            return (
              <div 
                key={item.id}
                onClick={() => handleImageClick(item.id)}
                className={`${isWide ? 'col-span-2 ' : ''}rounded-xl overflow-hidden h-[60px] relative cursor-pointer group`}
              >
                <img src={item.imageUrl} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {isWide && activeTab === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <PlayCircleIcon className="w-8 h-8 text-white/90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsGallery;
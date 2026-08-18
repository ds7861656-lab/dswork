import React from 'react';
import { useTranslation } from 'react-i18next';
import { StarIcon } from '@heroicons/react/24/solid';
import { type Activity } from '../../types/activity';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      {/* Image Section */}
      <div className="relative h-64 bg-gray-200 overflow-hidden rounded-[2rem] mb-5 shadow-sm">
        {activity.image ? (
          <img 
            src={activity.image} 
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {t('activity.noImage') || 'No Image'}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-2 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-[#2d4b5a] mb-2">
          {activity.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <StarIcon className="w-6 h-6 text-[#facc15]" />
          <span className="text-[#6b7280] font-medium text-lg whitespace-nowrap">
            {activity.rating} / {activity.reviews} {t('activity.reviews')}
          </span>
        </div>
        
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-col items-baseline min-w-0">
            <span className="text-[#ff6b6b] font-bold text-xl whitespace-nowrap shrink-0">{activity.price}</span>
            <span className="text-[#6b7280] font-medium whitespace-nowrap shrink-0">
              {t(`activity.units.${activity.unit}`, { count: activity.unitCount || 0 })}
            </span>
          </div>
          <button className="bg-[#2d4b5a] text-white px-5 sm:px-6 py-2.5 rounded-xl font-medium hover:bg-[#1f3642] transition-colors whitespace-nowrap shrink-0">
            {t('activity.bookNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;

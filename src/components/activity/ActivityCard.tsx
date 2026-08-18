import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { type Activity } from '../../types/activity';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <div className="flex flex-col">
      {/* Image Section */}
      <div className="relative h-64 bg-gray-200 overflow-hidden rounded-[2rem] mb-5 shadow-sm">
        {activity.isSpecial && (
          <div className="absolute top-6 -left-10 bg-white text-[#ff6b6b] text-xs tracking-widest font-extrabold py-1.5 px-12 transform -rotate-45 z-10 shadow-sm">
            SPECIALISE
          </div>
        )}
        {activity.image ? (
          <img 
            src={activity.image} 
            alt={activity.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
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
          <span className="text-[#6b7280] font-medium text-lg">
            {activity.rating} / {activity.reviews} reviews
          </span>
        </div>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-[#ff6b6b] font-bold text-xl">{activity.price}</span>
              <span className="text-[#6b7280] font-medium ml-1">{activity.unit}</span>
            </div>
            {activity.details && (
              <span className="text-[#ff6b6b] font-medium text-lg mt-0.5">{activity.details}</span>
            )}
          </div>
          <button className="bg-[#2d4b5a] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#1f3642] transition-colors">
            Book now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;

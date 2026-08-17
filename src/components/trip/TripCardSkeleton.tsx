import React from 'react';

const TripCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full animate-pulse">
      
      {/* 1. Hero Image Skeleton */}
      <div className="h-48 w-full bg-slate-200" />

      {/* 2. Content Body Skeleton */}
      <div className="p-5 grow flex flex-col gap-4">
        
        {/* Metadata Row (Date & Stops) */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded-md" /> {/* Date */}
          <div className="h-4 w-16 bg-slate-200 rounded-md" /> {/* Stops */}
        </div>

        {/* Title & Description */}
        <div className="space-y-3 mt-1">
          <div className="h-7 w-3/4 bg-slate-200 rounded-lg" /> {/* City Title */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-100 rounded-md" />
            <div className="h-3 w-5/6 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>

      {/* 3. Footer Actions Skeleton */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50 flex items-center gap-3">
        <div className="flex-1 h-9 bg-slate-200 rounded-lg" /> {/* View Button */}
        <div className="h-9 w-9 bg-slate-200 rounded-lg" />    {/* Share Button */}
      </div>
    </div>
  );
};

export default TripCardSkeleton;
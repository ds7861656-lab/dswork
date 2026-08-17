// src/components/car-rental/CarCard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { type Car } from '../../types/car';

interface CarCardProps {
  car: Car;
  onFavoriteToggle?: (carId: string) => void;
  isFavorite?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ car, onFavoriteToggle, isFavorite = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/car-rentals/${car.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(car.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
        >
          {isFavorite ? (
            <HeartIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartOutlineIcon className="w-5 h-5 text-gray-700" />
          )}
        </button>

        {/* Badge */}
        {car.rating >= 4.9 && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full shadow-lg">
            Guest favorite
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location & Rating */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 truncate flex-1">
            {car.location}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <StarIcon className="w-4 h-4 text-gray-800" />
            <span className="text-sm font-semibold text-gray-800">
              {car.rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({car.reviewCount})
            </span>
          </div>
        </div>

        {/* Car Name */}
        <h4 className="text-sm text-gray-600 mb-1 truncate">
          {car.name}
        </h4>

        {/* Type & Specs */}
        <p className="text-sm text-gray-500 mb-3">
          {car.type} · {car.seats} seats · {car.transmission}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-900">
            ${car.pricePerDay}
          </span>
          <span className="text-sm text-gray-500">
            / day
          </span>
        </div>
      </div>
    </div>
  );
};

export default CarCard;

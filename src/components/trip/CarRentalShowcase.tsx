// src/components/car-rental/CarRentalShowcase.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StarIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const CarRentalShowcase: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const cars = [
    {
      id: '1',
      name: "2021 GL8",
      type: "Luxury Van",
      image: "https://gmauthority.com/blog/wp-content/uploads/2024/04/2024-Buick-GL8-ES-PHEV-Avenir-Leaks-Photos-China-Press-Photos-Exterior-001-side-front-three-quarters.jpg",
      rating: 5,
      pricePerDay: 120
    },
    {
      id: '2',
      name: "Tesla Model Y",
      type: "Electric SUV",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/2023_Tesla_Model_Y_Long_Range_All-Wheel_Drive_in_Pearl_White_Multi-Coat%2C_front_right%2C_2024-09-25.jpg",
      rating: 5,
      pricePerDay: 150
    },
    {
      id: '3',
      name: "BMW X5",
      type: "Luxury SUV",
      image: "https://imgd.aeplcdn.com/1920x1080/n/cw/ec/152681/x5-exterior-right-front-three-quarter-6.jpeg?isig=0&q=80&q=80",
      rating: 4,
      pricePerDay: 180
    },
    {
      id: '4',
      name: "Citroën C5",
      type: "Comfort SUV",
      image: "https://citroen-magnusmotors.com/wp-content/uploads/2024/04/image-4.png",
      rating: 4,
      pricePerDay: 95
    }
  ];

  const handleViewMore = () => {
    navigate('/car-rentals');
  };

  const handleCarClick = (carId: string) => {
    navigate(`/car-rentals/${carId}`);
  };

  return (
    <div className="mt-2 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg font-bold text-gray-800">
          {t('trips.carRent') || 'Car Rental'}
        </h3>
        <button
          onClick={handleViewMore}
          className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors group"
        >
          <span>{t('trips.viewMore') || 'View all'}</span>
          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide hover:scrollbar-thin hover:scrollbar-thumb-gray-200">
        {cars.map((car) => (
          <div 
            key={car.id}
            onClick={() => handleCarClick(car.id)}
            className="shrink-0 w-36 bg-white p-2 rounded-xl border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-full h-20 mb-2 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
              <img 
                src={car.image} 
                alt={car.name} 
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-300" 
              />
            </div>
            <h4 className="text-xs font-bold text-gray-800 truncate">{car.name}</h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-gray-400">{car.type}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`w-2 h-2 ${i < car.rating ? 'text-yellow-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
            </div>
            <div className="mt-1 text-xs font-bold text-teal-600">
              ${car.pricePerDay}/day
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarRentalShowcase;

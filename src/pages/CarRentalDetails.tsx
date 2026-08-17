// src/pages/CarRentalDetails.tsx
// ✅ UPDATED: Fixed "Show all photos" button position

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  StarIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { mockCars } from '../data/mockCars';

const CarRentalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [dropoffTime, setDropoffTime] = useState('10:00');

  const car = mockCars.find(c => c.id === id);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
          <button
            onClick={() => navigate('/car-rentals')}
            className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const calculateTotalDays = () => {
    if (!pickupDate || !dropoffDate) return 0;
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  };

  const totalDays = calculateTotalDays();
  const subtotal = car.pricePerDay * totalDays;
  const insurance = car.insurance.basic * totalDays;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + insurance + serviceFee;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Full Photo Gallery Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen py-12 px-4">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed top-6 right-6 p-3 bg-white rounded-full hover:bg-gray-100 transition-colors z-10 shadow-lg"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="max-w-5xl mx-auto space-y-4">
              {car.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${car.name} - ${index + 1}`}
                  className="w-full rounded-2xl"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/car-rentals')} className="hover:text-gray-900 hover:underline">
            {t('trips.carRentals') || 'Car Rentals'}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{car.name}</span>
        </div>

        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                <span className="font-semibold">{car.rating}</span>
                <span className="text-gray-600">({car.reviewCount} {t('trips.reviews') || 'reviews'})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPinIcon className="w-4 h-4" />
                <span>{car.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {isFavorite ? (
                <HeartIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartOutlineIcon className="w-5 h-5" />
              )}
              <span className="font-medium">{t('trips.save') || 'Save'}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <ShareIcon className="w-5 h-5" />
              <span className="font-medium">{t('trips.share') || 'Share'}</span>
            </button>
          </div>
        </div>

        {/* ✅ FIXED: Photo Gallery with Better Button Position */}
        <div className="relative mb-8">
          <div className="grid grid-cols-4 gap-2 h-[500px] rounded-2xl overflow-hidden">
            {/* Main Large Image */}
            <div 
              className="col-span-4 md:col-span-2 row-span-2 cursor-pointer group relative overflow-hidden" 
              onClick={() => setShowAllPhotos(true)}
            >
              <img
                src={car.images[0]}
                alt={car.name}
                className="w-full h-full object-cover group-hover:brightness-95 transition-all"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
            </div>

            {/* Smaller Images */}
            {car.images.slice(1, 5).map((image, index) => (
              <div 
                key={index} 
                className="col-span-2 md:col-span-1 cursor-pointer group relative overflow-hidden" 
                onClick={() => setShowAllPhotos(true)}
              >
                <img
                  src={image}
                  alt={`${car.name} ${index + 2}`}
                  className="w-full h-full object-cover group-hover:brightness-95 transition-all"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                
                {/* ✅ Show button overlay on last image */}
                {index === 3 && car.images.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white font-semibold text-lg">
                      +{car.images.length - 5} {t('trips.photos') || 'photos'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ✅ FIXED: Better positioned "Show all photos" button */}
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 px-4 py-2 bg-white border border-gray-900 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-lg flex items-center gap-2"
          >
            <PhotoIcon className="w-5 h-5" />
            {t('trips.showAllPhotos') || 'Show all photos'}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="pb-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {car.type} {t('trips.hostedBy') || 'hosted by'} {car.hostName}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>{car.seats} {t('trips.seats') || 'seats'}</span>
                    <span>·</span>
                    <span>{car.specifications.doors} {t('trips.doors') || 'doors'}</span>
                    <span>·</span>
                    <span>{car.transmission}</span>
                  </div>
                </div>
                <img
                  src={car.hostImage}
                  alt={car.hostName || 'Host'}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
            </div>

            {/* Features */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('trips.whatCarOffers') || 'What this car offers'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-teal-600 shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('trips.aboutCar') || 'About this car'}
              </h3>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">{t('trips.fuelEconomy') || 'Fuel Economy'}</div>
                  <div className="font-semibold text-gray-900">{car.specifications.mileage}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">{t('trips.engine') || 'Engine'}</div>
                  <div className="font-semibold text-gray-900">{car.specifications.engineSize}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">{t('trips.luggage') || 'Luggage'}</div>
                  <div className="font-semibold text-gray-900">{car.specifications.luggage} {t('trips.bags') || 'bags'}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">{t('trips.year') || 'Year'}</div>
                  <div className="font-semibold text-gray-900">{car.year}</div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="pb-8 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('trips.cancellationPolicy') || 'Cancellation policy'}
              </h3>
              <p className="text-gray-700">{car.cancellationPolicy}</p>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <StarIcon className="w-6 h-6" />
                <h3 className="text-2xl font-bold">
                  {car.rating} · {car.reviewCount} {t('trips.reviews') || 'reviews'}
                </h3>
              </div>
              
              {/* Review Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  t('trips.cleanliness') || 'Cleanliness',
                  t('trips.communication') || 'Communication',
                  t('trips.checkIn') || 'Check-in',
                  t('trips.accuracy') || 'Accuracy',
                  t('trips.location') || 'Location',
                  t('trips.value') || 'Value'
                ].map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900" style={{ width: `${car.rating * 20}%` }} />
                      </div>
                      <span className="text-sm font-semibold w-8">{car.rating}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Reviews */}
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pb-6 border-b border-gray-200 last:border-0">
                    <div className="flex items-start gap-4">
                      <img
                        src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                        alt="Reviewer"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-semibold text-gray-900">{t('trips.guest') || 'Guest'} {i}</div>
                            <div className="text-sm text-gray-500">January 2024</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, j) => (
                              <StarIcon key={j} className="w-4 h-4" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">
                          {t('trips.sampleReview') || 'Great experience! The car was clean, comfortable, and exactly as described.'}
                          {car.hostName} {t('trips.wasResponsive') || 'was very responsive and helpful. Highly recommend!'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-gray-900">${car.pricePerDay}</span>
                <span className="text-gray-600">/ {t('trips.day') || 'day'}</span>
              </div>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                      {t('trips.pickup') || 'Pickup'}
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                      {t('trips.dropoff') || 'Dropoff'}
                    </label>
                    <input
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                      {t('trips.time') || 'Time'}
                    </label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                      {t('trips.time') || 'Time'}
                    </label>
                    <input
                      type="time"
                      value={dropoffTime}
                      onChange={(e) => setDropoffTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                disabled={!pickupDate || !dropoffDate || totalDays === 0}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors mb-4"
              >
                {t('trips.reserve') || 'Reserve'}
              </button>

              <p className="text-center text-sm text-gray-600 mb-6">
                {t('trips.wontBeCharged') || "You won't be charged yet"}
              </p>

              {/* Price Breakdown */}
              {totalDays > 0 && (
                <div className="space-y-3 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>${car.pricePerDay} x {totalDays} {t('trips.days') || 'days'}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>{t('trips.basicInsurance') || 'Basic insurance'}</span>
                    <span>${insurance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>{t('trips.serviceFee') || 'Service fee'}</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>{t('trips.total') || 'Total'}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Insurance Options */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-teal-600 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t('trips.insuranceIncluded') || 'Insurance included'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t('trips.basicCoverage') || 'Basic coverage included. Upgrade to premium for'} ${car.insurance.premium}/{t('trips.day') || 'day'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarRentalDetails;

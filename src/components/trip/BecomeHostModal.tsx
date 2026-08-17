// src/components/car-rental/BecomeHostModal.tsx

import React, { useState } from 'react';
import { XMarkIcon, CheckIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface BecomeHostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  // Step 1: Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber: string;
  birthday: string;
  
  // Step 2: Billing Address
  street: string;
  country: string;
  city: string;
  zipCode: string;
  state: string;
  
  // Step 3: Insurance
  insuranceType: 'none' | 'standard' | 'premium';
  
  // Step 4: Car Details
  carMake: string;
  carModel: string;
  carYear: string;
  carType: string;
  seats: string;
  transmission: string;
  fuelType: string;
  mileage: string;
  
  // Step 5: Pricing
  pricePerDay: string;
  location: string;
  
  // Step 6: Photos
  photos: File[];
}

const BecomeHostModal: React.FC<BecomeHostModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passportNumber: '',
    birthday: '',
    street: '',
    country: '',
    city: '',
    zipCode: '',
    state: '',
    insuranceType: 'none',
    carMake: '',
    carModel: '',
    carYear: '',
    carType: 'SUV',
    seats: '5',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    mileage: '',
    pricePerDay: '',
    location: '',
    photos: []
  });

  const totalSteps = 6;

  const steps = [
    { number: 1, title: t('trips.contactInfo') || 'Contact Information' },
    { number: 2, title: t('trips.billingAddress') || 'Billing Address' },
    { number: 3, title: t('trips.insurance') || 'Add Insurance' },
    { number: 4, title: t('trips.carDetails') || 'Car Details' },
    { number: 5, title: t('trips.pricing') || 'Pricing & Location' },
    { number: 6, title: t('trips.photos') || 'Upload Photos' }
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...filesArray] }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // TODO: Send to backend
    alert('Application submitted successfully! We will review your information and contact you soon.');
    onClose();
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-teal-700 to-teal-600 text-white px-8 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {t('trips.becomeHost') || 'Become a Car Rental Host'}
                </h2>
                <p className="text-teal-100 text-sm mt-1">
                  {t('trips.stepProgress') || `Step ${currentStep} of ${totalSteps}`}: {steps[currentStep - 1].title}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 flex gap-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex-1 h-2 rounded-full overflow-hidden bg-teal-800"
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      step.number <= currentStep ? 'bg-white' : 'bg-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.firstName') || 'First Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.lastName') || 'Last Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('trips.email') || 'Email'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.mobilePhone') || 'Mobile Phone'}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.passportNumber') || 'Passport Number'}
                    </label>
                    <input
                      type="text"
                      value={formData.passportNumber}
                      onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="A12345678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('trips.birthday') || 'Birthday'}
                  </label>
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => handleInputChange('birthday', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Billing Address */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('trips.street') || 'Street'}
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.country') || 'Country'}
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CN">China</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.city') || 'City'}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Beijing"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.zipCode') || 'Zip Code'}
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.state') || 'State'}
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Beijing"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Insurance */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('trips.chooseInsurance') || 'Choose Your Insurance Plan'}
                  </h3>
                  <p className="text-gray-600">
                    {t('trips.protectYourself') || 'Protect yourself and your car'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* No Insurance */}
                  <button
                    onClick={() => handleInputChange('insuranceType', 'none')}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      formData.insuranceType === 'none'
                        ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <XMarkIcon className="w-6 h-6 text-gray-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {t('trips.noThanks') || 'No, thanks'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t('trips.basicCoverageOnly') || 'Basic coverage only'}
                      </p>
                      <div className="mt-3 text-lg font-bold text-gray-900">$0</div>
                    </div>
                  </button>

                  {/* Standard */}
                  <button
                    onClick={() => handleInputChange('insuranceType', 'standard')}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      formData.insuranceType === 'standard'
                        ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {t('trips.standard') || 'Standard'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t('trips.recommendedPlan') || 'Recommended'}
                      </p>
                      <div className="mt-3 text-lg font-bold text-gray-900">$15/day</div>
                    </div>
                  </button>

                  {/* Premium */}
                  <button
                    onClick={() => handleInputChange('insuranceType', 'premium')}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      formData.insuranceType === 'premium'
                        ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        {t('trips.premium') || 'Premium'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t('trips.fullCoverage') || 'Full coverage'}
                      </p>
                      <div className="mt-3 text-lg font-bold text-gray-900">$30/day</div>
                    </div>
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <strong>{t('trips.note') || 'Note'}:</strong>{' '}
                    {t('trips.insuranceNote') || 'Insurance coverage helps protect both you and renters in case of accidents or damage.'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Car Details */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.carMake') || 'Car Make'}
                    </label>
                    <input
                      type="text"
                      value={formData.carMake}
                      onChange={(e) => handleInputChange('carMake', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Toyota"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.carModel') || 'Car Model'}
                    </label>
                    <input
                      type="text"
                      value={formData.carModel}
                      onChange={(e) => handleInputChange('carModel', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Camry"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.year') || 'Year'}
                    </label>
                    <input
                      type="text"
                      value={formData.carYear}
                      onChange={(e) => handleInputChange('carYear', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="2023"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.carType') || 'Car Type'}
                    </label>
                    <select
                      value={formData.carType}
                      onChange={(e) => handleInputChange('carType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="SUV">SUV</option>
                      <option value="Sedan">Sedan</option>
                      <option value="Van">Van</option>
                      <option value="Electric">Electric</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.seats') || 'Seats'}
                    </label>
                    <select
                      value={formData.seats}
                      onChange={(e) => handleInputChange('seats', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="7">7</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.transmission') || 'Transmission'}
                    </label>
                    <select
                      value={formData.transmission}
                      onChange={(e) => handleInputChange('transmission', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('trips.fuelType') || 'Fuel Type'}
                    </label>
                    <select
                      value={formData.fuelType}
                      onChange={(e) => handleInputChange('fuelType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('trips.mileage') || 'Mileage (km)'}
                  </label>
                  <input
                    type="text"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="50000"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Pricing & Location */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('trips.pricePerDay') || 'Price Per Day ($)'}
                  </label>
                  <input
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) => handleInputChange('pricePerDay', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {t('trips.pricingTip') || 'Suggested pricing: $80-$150 per day based on your car type'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('trips.pickupLocation') || 'Pickup Location'}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Beijing, China"
                  />
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                  <h4 className="font-semibold text-teal-900 mb-2">
                    {t('trips.estimatedEarnings') || 'Estimated Monthly Earnings'}
                  </h4>
                  <p className="text-3xl font-bold text-teal-600">
                    ${formData.pricePerDay ? (parseFloat(formData.pricePerDay) * 20).toFixed(0) : '0'}
                  </p>
                  <p className="text-sm text-teal-700 mt-1">
                    {t('trips.basedOn') || 'Based on 20 rental days per month'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Photos */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('trips.uploadPhotos') || 'Upload Car Photos'}
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('trips.photosTip') || 'Upload at least 3 high-quality photos of your car (exterior, interior, dashboard)'}
                  </p>
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="block w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-500 transition-colors cursor-pointer text-center"
                  >
                    <div className="text-gray-600">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-sm font-medium">{t('trips.clickToUpload') || 'Click to upload photos'}</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                    </div>
                  </label>
                </div>

                {/* Photo Preview Grid */}
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Car ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-gray-50 px-8 py-6 rounded-b-2xl border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              {t('trips.back') || 'Back'}
            </button>

            <div className="flex items-center gap-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step.number === currentStep
                      ? 'bg-teal-600 w-8'
                      : step.number < currentStep
                      ? 'bg-teal-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white hover:bg-teal-700 rounded-xl transition-colors font-semibold shadow-lg"
              >
                {t('trips.next') || 'Next'}
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-700 hover:to-teal-600 rounded-xl transition-all font-bold shadow-xl"
              >
                <CheckIcon className="w-5 h-5" />
                {t('trips.submit') || 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeHostModal;

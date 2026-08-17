import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface ProfileFormData {
  username: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
}

interface PersonalDetailsFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ 
  initialData, 
  onSubmit, 
  isLoading = false 
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({});

  // Reset form when initialData changes (e.g. on fresh load)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name as keyof ProfileFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {};
    
    if (!formData.username.trim()) newErrors.username = t('profile.validation.usernameRequired');
    if (!formData.mobile.trim()) newErrors.mobile = t('profile.validation.mobileRequired');
    if (!formData.dob) newErrors.dob = t('profile.validation.dobRequired');
    if (!formData.gender) newErrors.gender = t('profile.validation.genderRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    await onSubmit(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(initialData);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('trips.editProfile')}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('profile.subtitle', 'Manage your personal information')}
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
          >
            {t('common.edit', 'Edit')}
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Username */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.username')}
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={t('profile.usernamePlaceholder')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
              </div>
            ) : (
              <p className="py-2 text-gray-900 border-b border-gray-100">{formData.username}</p>
            )}
          </div>

          {/* Email - Always Read Only */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.email')}
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              {isEditing && (
                <div className="absolute right-3 top-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {isEditing && (
              <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {t('profile.emailNote')}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.mobile')}
            </label>
            {isEditing ? (
              <div>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder={t('profile.mobilePlaceholder')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    errors.mobile ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
              </div>
            ) : (
              <p className="py-2 text-gray-900 border-b border-gray-100">{formData.mobile || '—'}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.dob')}
            </label>
            {isEditing ? (
              <div>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                    errors.dob ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
              </div>
            ) : (
              <p className="py-2 text-gray-900 border-b border-gray-100">
                {formData.dob ? new Date(formData.dob).toLocaleDateString() : '—'}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('profile.gender')}
            </label>
            {isEditing ? (
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 transition-colors ${
                    formData.gender === 'Male' ? 'border-teal-600' : 'border-gray-300 group-hover:border-teal-400'
                  }`}>
                    {formData.gender === 'Male' && <div className="w-2.5 h-2.5 bg-teal-600 rounded-full" />}
                  </div>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <span className="text-gray-700">{t('profile.male')}</span>
                </label>
                
                <label className="flex items-center cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 transition-colors ${
                    formData.gender === 'Female' ? 'border-teal-600' : 'border-gray-300 group-hover:border-teal-400'
                  }`}>
                    {formData.gender === 'Female' && <div className="w-2.5 h-2.5 bg-teal-600 rounded-full" />}
                  </div>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <span className="text-gray-700">{t('profile.female')}</span>
                </label>
              </div>
            ) : (
              <p className="py-2 text-gray-900">
                {formData.gender === 'Male' ? t('profile.male') : 
                 formData.gender === 'Female' ? t('profile.female') : '—'}
              </p>
            )}
            {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              {t('profile.cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {t('profile.update')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalDetailsForm;
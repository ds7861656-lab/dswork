import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SecuritySettingsProps {
  onUpdatePassword: (current: string, newPass: string) => Promise<void>;
  isLoading?: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ 
  onUpdatePassword, 
  isLoading = false 
}) => {
  const { t } = useTranslation();
  const [isExpanding, setIsExpanding] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [strength, setStrength] = useState(0);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false); // Mock state for UI demonstration

  // Calculate password strength
  useEffect(() => {
    const val = passwords.new;
    let score = 0;
    if (!val) {
      setStrength(0);
      return;
    }
    if (val.length > 7) score += 1;
    if (val.length > 10) score += 1;
    if (/[A-Z]/.test(val)) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;
    setStrength(score);
  }, [passwords.new]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    // Clear errors on type
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!passwords.current) newErrors.current = t('profile.validation.passwordRequired', 'Current password is required');
    if (passwords.new.length < 8) newErrors.new = t('profile.validation.passwordTooShort');
    if (passwords.new !== passwords.confirm) newErrors.confirm = t('profile.validation.passwordMismatch');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    await onUpdatePassword(passwords.current, passwords.new);
    // Reset form on success (parent handles errors)
    setPasswords({ current: '', new: '', confirm: '' });
    setIsExpanding(false);
  };

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{t('profile.security.title')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('profile.security.description')}</p>
      </div>

      <div className="space-y-6">
        
        {/* Two-Factor Authentication Toggle (Mock UI) */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm h-fit">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{t('profile.security.twoFactor')}</h3>
              <p className="text-xs text-gray-500 mt-1">{t('profile.security.twoFactorDesc')}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIs2FAEnabled(!is2FAEnabled)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 ${
              is2FAEnabled ? 'bg-teal-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={is2FAEnabled}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                is2FAEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Change Password Section */}
        <div className="border-t border-gray-100 pt-6">
          {!isExpanding ? (
            <button
              onClick={() => setIsExpanding(true)}
              className="flex items-center text-teal-700 font-medium hover:text-teal-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {t('profile.security.changePassword')}
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
              <h3 className="font-medium text-gray-900 mb-4">{t('profile.security.changePassword')}</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('profile.security.currentPassword')}
                </label>
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                {errors.current && <p className="mt-1 text-xs text-red-500">{errors.current}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.security.newPassword')}
                  </label>
                  <input
                    type="password"
                    name="new"
                    value={passwords.new}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {/* Strength Meter */}
                  {passwords.new && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">{t('profile.security.passwordStrength', 'Strength')}</span>
                        <span className="text-xs font-medium text-gray-700">{getStrengthLabel()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`} 
                          style={{ width: `${(strength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {errors.new && <p className="mt-1 text-xs text-red-500">{errors.new}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.security.confirmNewPassword')}
                  </label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanding(false);
                    setPasswords({ current: '', new: '', confirm: '' });
                    setErrors({});
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('profile.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || strength < 2} // Prevent weak passwords
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('profile.updating') : t('profile.update')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
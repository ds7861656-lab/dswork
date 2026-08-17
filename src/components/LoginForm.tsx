import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from '../contexts/SnackbarContext';
import { i18nErrorHandler } from '../utils/i18nErrorHandler';
import type { AuthError } from 'firebase/auth';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

interface LoginFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  rememberMe: boolean;
  agree: boolean;
}

interface LoginFormProps {
  redirectTo?: string;
  showForgotPasswordLink?: boolean;
  onLoginSuccess?: () => void;
  onLoginError?: (error: Error) => void;
  variant?: 'card' | 'plain';
}

type AuthMode = 'login' | 'register' | 'forgot';

const LoginForm: React.FC<LoginFormProps> = ({
  redirectTo = '/',
  showForgotPasswordLink = true,
  onLoginSuccess,
  onLoginError,
  variant = 'card',
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const isRegisterMode = authMode === 'register';
  const isForgotMode = authMode === 'forgot';

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<LoginFormData>({
    mode: 'onChange',
  });
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSuccess } = useSnackbar();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      if (isRegisterMode) {
        await registerWithEmail(data.email, data.password);
      } else {
        await loginWithEmail(data.email, data.password);
      }
      setShowSuccessMessage(true);
      showSuccess(isRegisterMode ? t('loginForm.registrationSuccess') : t('loginForm.loginSuccess'));

      if (onLoginSuccess) onLoginSuccess();

      setTimeout(() => {
        navigate(redirectTo);
      }, 1000);
    } catch (error) {
      console.error(`${isRegisterMode ? 'Registration' : 'Login'} failed:`, error);
      const authError = error as AuthError;
      
      i18nErrorHandler.showErrorToUser(
        authError,
        { component: 'LoginForm', action: 'onSubmit' },
        [],
        t.bind(t)
      );

      if (onLoginError && error instanceof Error) onLoginError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      setShowSuccessMessage(true);
      showSuccess(t('loginForm.loginSuccess'));
      if (onLoginSuccess) onLoginSuccess();
      setTimeout(() => navigate(redirectTo), 1000);
    } catch (error) {
      console.error('Google login failed:', error);
      i18nErrorHandler.showErrorToUser(
        error,
        { component: 'LoginForm', action: 'handleGoogleLogin' },
        [],
        t.bind(t)
      );
      if (onLoginError && error instanceof Error) onLoginError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerClasses = variant === 'card' 
    ? "bg-white rounded-2xl p-8 shadow-xl" 
    : "w-full";

  return (
    <div className={variant === 'card' ? "max-w-md mx-auto" : "w-full"}>
      <div className={containerClasses}>
        {variant === 'card' && (
          <h2 className="text-2xl font-medium text-center mb-6 text-gray-800">
            {isForgotMode ? t('loginForm.forgotPassword') : t('loginForm.title')}
          </h2>
        )}

        {/* Forgot Password Frame */}
        {isForgotMode ? (
          <ForgotPasswordForm onBackToLogin={() => setAuthMode('login')} />
        ) : (
          <>
            {/* Success Message */}
            {showSuccessMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                <div className="flex-1">
                  <p className="font-medium">{isRegisterMode ? t('loginForm.registrationSuccess') : t('loginForm.loginSuccess')}</p>
                </div>
              </div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-base font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('loginForm.continueWithGoogle')}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('loginForm.or')}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('loginForm.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: t('loginForm.emailRequired'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('loginForm.emailInvalid')
                    }
                  })}
                  placeholder={t('loginForm.emailPlaceholder')}
                  className={`w-full p-3 border rounded-lg text-base outline-none transition focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('loginForm.password')}
                  </label>
                  {!isRegisterMode && showForgotPasswordLink && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="text-xs font-medium text-teal-600 hover:text-teal-800"
                    >
                      {t('loginForm.forgotPassword')}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password', { 
                      required: t('loginForm.passwordRequired'),
                      minLength: {
                        value: 8,
                        message: t('loginForm.passwordMinLength')
                      }
                    })}
                    placeholder={t('loginForm.passwordPlaceholder')}
                    className={`w-full p-3 border rounded-lg text-base outline-none transition focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 pr-10 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {isRegisterMode && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('loginForm.confirmPassword')}
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    {...register('confirmPassword', {
                      required: isRegisterMode ? t('loginForm.passwordRequired') : false,
                      validate: (value) => {
                        if (isRegisterMode && value !== watch('password')) {
                          return t('loginForm.passwordsDoNotMatch');
                        }
                        return true;
                      }
                    })}
                    placeholder={t('loginForm.confirmPasswordPlaceholder')}
                    className={`w-full p-3 border rounded-lg text-base outline-none transition focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  {...register('agree', { required: t('loginForm.agreeRequired') })}
                  className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="agree" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
                  {t('loginForm.agreeToTerms')} <Link to="/terms" className="text-teal-600 hover:underline">{t('loginForm.terms')}</Link> {t('loginForm.and')} <Link to="/privacy" className="text-teal-600 hover:underline">{t('loginForm.privacy')}</Link>
                </label>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-xs">{errors.agree.message}</p>
              )}

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full h-12 bg-teal-800 text-white rounded-lg text-base font-medium hover:bg-teal-900 transition-all shadow-sm shadow-teal-900/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isRegisterMode ? t('loginForm.signingUp') : t('loginForm.signingIn')}
                  </span>
                ) : (
                  isRegisterMode ? t('loginForm.signUp') : t('loginForm.signIn')
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-8 text-center text-sm">
              <span className="text-gray-500">
                {isRegisterMode ? t('loginForm.alreadyHaveAccount') : t('loginForm.noAccount')}
              </span>
              <button
                type="button"
                onClick={() => setAuthMode(isRegisterMode ? 'login' : 'register')}
                className="ml-2 text-teal-700 font-medium hover:text-teal-900 hover:underline transition-all"
              >
                {isRegisterMode ? t('loginForm.signIn') : t('loginForm.signUp')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;

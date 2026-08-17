import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useTranslation } from 'react-i18next';

type ForgotPasswordFormData = {
  email: string;
};

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
 // const { resetPassword } = useAuth();
  const { showSuccess } = useSnackbar();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
   // await resetPassword(data.email);
    showSuccess(t('loginForm.resetEmailSent'));
    onBackToLogin();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {t('loginForm.email')}
        </label>
        <input
          type="email"
          {...register('email', {
            required: t('loginForm.emailRequired'),
            pattern: {
              value: /^\S+@\S+$/i,
              message: t('loginForm.invalidEmail'),
            },
          })}
          className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-teal-600 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {isSubmitting
          ? t('loginForm.processing')
          : t('loginForm.sendResetLink')}
      </button>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-teal-700 font-medium hover:underline"
        >
          ← {t('loginForm.backToLogin')}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;

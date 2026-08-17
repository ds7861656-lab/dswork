import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { apiClient } from '../services/apiClient';

interface ChineseLoginFormData {
  email: string;
  code: string;
  rememberMe: boolean;
  agree: boolean;
}

interface ChineseLoginFormProps {
  redirectTo?: string;
  onLoginSuccess?: () => void;
  onLoginError?: (error: Error) => void;
}

const ChineseLoginForm: React.FC<ChineseLoginFormProps> = ({
  redirectTo = '/',
  onLoginSuccess,
  onLoginError,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ChineseLoginFormData>({
    mode: 'onChange',
  });
  const { loginWithEmailCode } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const handleSendCode = async (email: string) => {
    setIsSubmitting(true);
    try {
      // Call email verification code API using centralized service
      const result = await apiClient.sendEmailCode(email);

      if (result.code === 200) {
        setIsCodeSent(true);
        showSuccess('验证码已发送，请检查邮箱');
        setStep('code');
      } else {
        throw new Error(result.message || '发送验证码失败');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : '发送验证码失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: ChineseLoginFormData) => {
    if (!isCodeSent || step === 'email') {
      await handleSendCode(data.email);
      return;
    }

    setIsSubmitting(true);
    console.log('Attempting email code login:', { email: data.email, code: data.code });

    try {
      await loginWithEmailCode(data.email, data.code);
      setShowSuccessMessage(true);
      showSuccess('登录成功');

      // Call the success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(redirectTo);
      }, 1000);
    } catch (error) {
      console.error('Email code login failed:', error);
      
      // Call the error callback if provided
      if (onLoginError && error instanceof Error) {
        onLoginError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <h2 className="text-xl font-medium text-center text-gray-800">
        邮箱验证登录
      </h2>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          <div className="flex items-center justify-between">
            <span>登录成功</span>
            <Link
              to="/subscription"
              className="text-green-600 hover:text-green-700 underline font-medium text-sm"
            >
              立即订阅
            </Link>
          </div>
        </div>
      )}



      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            邮箱地址
          </label>
          <input
            type="email"
            id="email"
            {...register('email', { 
              required: '请输入邮箱地址',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '请输入有效的邮箱地址'
              }
            })}
            placeholder="请输入邮箱地址"
            disabled={isCodeSent}
            className="w-full p-3 border border-gray-300 rounded-lg text-base outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition disabled:bg-gray-50 disabled:text-gray-500"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-xs" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {step === 'code' && (
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              验证码
            </label>
            <input
              type="text"
              id="code"
              {...register('code', {
                required: '请输入验证码',
                pattern: {
                  value: /^\d{6}$/,
                  message: '请输入6位数字验证码'
                }
              })}
              placeholder="请输入6位验证码"
              maxLength={6}
              className="w-full p-3 border border-gray-300 rounded-lg text-base outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
              aria-invalid={errors.code ? 'true' : 'false'}
              aria-describedby={errors.code ? 'code-error' : undefined}
            />
            {errors.code && (
              <p id="code-error" className="text-red-500 text-xs" role="alert">
                {errors.code.message}
              </p>
            )}
          </div>
        )}

        {step === 'code' && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setIsCodeSent(false);
              }}
              className="text-teal-600 hover:text-teal-700 transition text-sm"
            >
              返回修改邮箱
            </button>
          </div>
        )}

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agree"
            {...register('agree', { required: '请同意用户协议和隐私政策' })}
            className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            aria-invalid={errors.agree ? 'true' : 'false'}
          />
          <label htmlFor="agree" className="text-xs text-gray-600 leading-relaxed">
            登录即表示同意
            <Link to="/terms" className="text-teal-600 hover:underline mx-1">《用户协议》</Link>
            和
            <Link to="/privacy" className="text-teal-600 hover:underline mx-1">《隐私政策》</Link>
          </label>
        </div>
        {errors.agree && (
          <p className="text-red-500 text-xs" role="alert">
            {errors.agree.message}
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full h-12 bg-teal-600 text-white border-none rounded-lg text-base font-medium cursor-pointer hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {step === 'email' ? '发送验证码中...' : '登录中...'}
            </span>
          ) : (
            step === 'email' ? '发送验证码' : '登录'
          )}
        </button>
      </form>

      {/* Helper Links */}
      <div className="flex justify-center">
        <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          遇到问题? 联系客服
        </button>
      </div>
    </div>
  );
};

export default ChineseLoginForm;
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';
import ManasLogo, { ManasLogoMark } from '@/components/ManasLogo';
import { api } from '@/services/api';
import { safeLocalStorage } from '@/utils/storage';

export default function LoginPage() {
  const router = useRouter();
  const { login, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'sms'>('email');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({
        username_or_email: formData.email,
        password: formData.password
      });
      router.push('/profile');
      toast.success('Welcome back! 🌸');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmsSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.initiateSmsLogin(phone);
      setOtpSent(true);
      toast.success('OTP sent to your phone number via SMS');
    } catch (error) {
      console.error('SMS Login Init Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmsVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.verifySmsLogin(phone, otp);
      safeLocalStorage.setItem('token', response.token);
      setUser(response.user);
      router.push('/profile');
      toast.success('Welcome back! 🌸');
    } catch (error) {
      console.error('SMS Verify Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pt-16 bg-white">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <ManasLogo variant="auth" />
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">
              Sign in to continue your journey with us
            </p>
          </div>

          {/* Login Method Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginMethod === 'email'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
                }`}
              onClick={() => setLoginMethod('email')}
            >
              Email
            </button>
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginMethod === 'sms'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
                }`}
              onClick={() => setLoginMethod('sms')}
            >
              Phone (SMS)
            </button>
          </div>

          {/* Email Form */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 disabled:opacity-50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* SMS OTP Form */}
          {loginMethod === 'sms' && (
            <div className="space-y-6">
              {!otpSent ? (
                <form onSubmit={handleSmsSendOTP} className="space-y-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                      placeholder="e.g. 919876543210"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 disabled:opacity-50"
                    />
                    <p className="mt-1 text-xs text-slate-500">Include country code without + (e.g., 91 for India)</p>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-all duration-300 shadow-warm hover:shadow-warm-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP via SMS'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSmsVerify} className="space-y-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-slate-600">OTP sent to <span className="font-semibold">{phone}</span></p>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                    >
                      Change Number
                    </button>
                  </div>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={isLoading}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 disabled:opacity-50 text-center tracking-widest text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 active:bg-primary-800 transition-all duration-300 shadow-warm hover:shadow-warm-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Register link */}
          <p className="mt-8 text-center text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Register for remarriage
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 items-center justify-center p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-md">
          <div className="mb-8 flex justify-center">
            <ManasLogoMark className="h-32 w-32 rounded-3xl" sizes="128px" onDarkPanel />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Empowering Women, Transforming Lives
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            Join our community of hope and support. Together, we&apos;re breaking barriers and creating new beginnings.
          </p>

          {/* Stats */}
          <div className="mt-12 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm text-primary-200">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm text-primary-200">Districts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">2022</div>
              <div className="text-sm text-primary-200">Serving Since</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

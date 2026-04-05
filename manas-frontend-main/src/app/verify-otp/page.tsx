'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/services/api';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const identifier = email || phone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast.error('Email or Phone is required for verification');
      return;
    }

    setLoading(true);
    try {
      await api.verifyOTP(email || undefined, phone || undefined, otp);
      toast.success('Verified successfully!');
      router.push('/login');
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!identifier) {
      toast.error('Identity is required to resend OTP');
      return;
    }

    setLoading(true);
    try {
      await api.resendOTP(email || undefined, phone || undefined);
      toast.success('OTP resent successfully!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!identifier) {
    return (
      <div className="min-h-screen bg-hope-light">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow-card rounded-3xl p-8">
              <h1 className="text-3xl font-bold text-center text-red-600 mb-8">Error</h1>
              <p className="text-center text-slate-600 mb-8">
                Email or phone number is required for verification. Please register for remarriage first.
              </p>
              <Button
                onClick={() => router.push('/register')}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                Register for remarriage
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hope-light">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-card rounded-3xl p-8">
            <h1 className="text-3xl font-bold text-center text-primary-600 mb-8">
              Verify Your {phone ? 'Phone' : 'Email'}
            </h1>
            <p className="text-center text-slate-600 mb-8">
              Please enter the verification code sent to <span className="font-semibold">{identifier}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  maxLength={6}
                  minLength={6}
                  disabled={loading}
                  className="mt-1 text-center text-lg tracking-widest"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 text-lg"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Confirm OTP'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-primary-600 hover:text-primary-500 text-sm"
                >
                  Didn&apos;t receive the code? Resend
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-hope-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}

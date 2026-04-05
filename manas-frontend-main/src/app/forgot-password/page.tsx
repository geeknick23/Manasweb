import Link from 'next/link';
import type { Metadata } from 'next';
import { Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Forgot Password | MANAS Foundation',
  description: 'Recover access to your Manas Bandhan account.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-hope-light flex items-center justify-center px-4 py-16 pt-24">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card-hover border border-slate-100 p-8 md:p-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Mail className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900 mb-3">Reset your password</h1>
        <p className="text-slate-600 leading-relaxed mb-8">
          Self-service password reset is not enabled on this site yet. Please email us from the address you used to
          register—we will verify you and send reset instructions.
        </p>
        <a
          href="mailto:manasfoundation2025@gmail.com?subject=Password%20reset%20request"
          className="block w-full text-center btn-primary mb-4"
        >
          Email manasfoundation2025@gmail.com
        </a>
        <p className="text-center text-sm text-slate-500">
          Or{' '}
          <Link href="/contact" className="text-primary-600 font-medium hover:text-primary-700">
            use the contact form
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

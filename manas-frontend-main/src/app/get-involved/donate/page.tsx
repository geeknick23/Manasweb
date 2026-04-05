import Link from 'next/link';
import type { Metadata } from 'next';
import { Heart, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Donate | MANAS Foundation',
  description: 'Support MANAS Foundation—online giving coming soon; contact us to donate today.',
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-hope-light">
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center text-primary mx-auto mb-8">
          <Heart className="w-10 h-10" fill="currentColor" />
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Support our mission</h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          Secure online donations are coming soon. Your support funds training, community programs, and direct help for
          women we serve. You can reach us today using the options below—mention &quot;Donation&quot; in your message.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="tel:+919876543210"
            className="inline-flex items-center justify-center gap-2 btn-primary"
          >
            <Phone className="w-5 h-5" />
            Call +91-98765-43210
          </a>
          <a
            href="mailto:manasfoundation2025@gmail.com?subject=Donation%20to%20MANAS%20Foundation"
            className="inline-flex items-center justify-center gap-2 btn-secondary"
          >
            <Mail className="w-5 h-5" />
            Email us
          </a>
        </div>
        <p className="text-sm text-slate-500 mb-6">All donations are processed per Indian regulations; receipts issued where applicable.</p>
        <Link href="/get-involved" className="text-primary-600 font-semibold hover:text-primary-700">
          ← Other ways to get involved
        </Link>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Scale, CheckCircle, ArrowLeft } from 'lucide-react';

const points = [
  'Awareness sessions on rights, documentation, and available remedies',
  'Signposting to qualified legal aid where case-specific help is needed',
  'Support to navigate social pressure alongside formal processes',
];

export default function LegalProgramPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          All programs
        </Link>
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Legal Awareness</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          Many women we work with face property disputes, custody questions, or harassment. We provide structured
          awareness and careful referrals—we are not a law firm, but we help you understand the landscape.
        </p>
        <ul className="space-y-4 mb-12">
          {points.map((item) => (
            <li key={item} className="flex gap-3 text-foreground">
              <span className="mt-0.5 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-primary" />
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-4">
          <Link href="/contact" className="btn-primary">
            Request guidance
          </Link>
          <Link href="/privacy-policy" className="btn-secondary">
            How we handle your data
          </Link>
        </div>
      </section>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { HeartHandshake, CheckCircle, ArrowLeft } from 'lucide-react';

const points = [
  'Events and gatherings that reduce isolation and stigma',
  'Peer networks and introductions to others on similar journeys',
  'Coordination with families and local leaders where appropriate',
];

export default function CommunityProgramPage() {
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
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Community Support</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          Beyond training and legal information, women need trusted community. We host programs, circles, and
          celebrations that honour dignity and belonging.
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
          <Link href="/get-involved" className="btn-primary">
            Join an event
          </Link>
          <Link href="/contact" className="btn-secondary">
            Talk to our team
          </Link>
        </div>
      </section>
    </div>
  );
}

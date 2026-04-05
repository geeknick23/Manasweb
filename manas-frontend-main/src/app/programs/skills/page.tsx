'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';

const points = [
  'Tailored training aligned with local job markets and self-employment',
  'Mentoring and follow-up so skills translate into income',
  'Partnerships with trainers and employers where available',
];

export default function SkillsProgramPage() {
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
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Skill Development</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          We run vocational and soft-skills programs so women can move toward stable income and independence—whether
          through wage work or small enterprise.
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
          <Link href="/get-involved/volunteer" className="btn-primary">
            Volunteer with training
          </Link>
          <Link href="/contact" className="btn-secondary">
            Ask about programs
          </Link>
        </div>
      </section>
    </div>
  );
}

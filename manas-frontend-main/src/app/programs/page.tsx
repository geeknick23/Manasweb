'use client';

import Link from 'next/link';
import { BookOpen, HeartHandshake, Scale, ArrowRight } from 'lucide-react';

const programs = [
  {
    href: '/programs/skills',
    title: 'Skill Development',
    description:
      'Vocational training and employability programs so women can build financial independence.',
    icon: BookOpen,
    accent: 'primary' as const,
  },
  {
    href: '/programs/community',
    title: 'Community Support',
    description:
      'Safe spaces, peer networks, and emotional support through events and gatherings.',
    icon: HeartHandshake,
    accent: 'secondary' as const,
  },
  {
    href: '/programs/legal',
    title: 'Legal Awareness',
    description:
      'Guidance on rights, documentation, and navigating legal and social systems with dignity.',
    icon: Scale,
    accent: 'cta' as const,
  },
];

const accentStyles = {
  primary: {
    blob: 'bg-primary-100',
    iconWrap: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white',
    link: 'text-primary',
  },
  secondary: {
    blob: 'bg-secondary-100',
    iconWrap: 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white',
    link: 'text-secondary',
  },
  cta: {
    blob: 'bg-cta/10',
    iconWrap: 'bg-cta/10 text-cta group-hover:bg-cta group-hover:text-white',
    link: 'text-cta',
  },
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-primary-100 rounded-full blur-3xl opacity-40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-white text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            What We Run on the Ground
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Our <span className="text-primary">Programs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Practical initiatives that help women rebuild confidence, livelihoods, and community—aligned with
            everything you see on our home page.
          </p>
        </div>
      </section>

      <section className="py-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((p) => {
              const Icon = p.icon;
              const s = accentStyles[p.accent];
              return (
                <Link key={p.href} href={p.href} className="group block h-full">
                  <div
                    className={`relative bg-card rounded-[2rem] p-10 shadow-sm border border-border/50 h-full transition-all duration-500 hover:shadow-xl hover:border-primary/20 hover:-translate-y-2 overflow-hidden`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 ${s.blob} rounded-bl-[100px] opacity-80 transition-transform duration-500 group-hover:scale-110`}
                    />
                    <div
                      className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500 ${s.iconWrap}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-semibold font-display mb-4 text-foreground">{p.title}</h2>
                    <p className="text-muted-foreground mb-8 leading-relaxed font-light">{p.description}</p>
                    <div className={`text-sm font-semibold flex items-center gap-2 ${s.link}`}>
                      Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Want to volunteer, donate, or refer someone who needs support?
            </p>
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Get involved
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

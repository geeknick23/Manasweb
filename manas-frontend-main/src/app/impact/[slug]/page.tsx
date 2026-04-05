'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { ImpactCardType } from '@/types/cards';

interface PageProps {
  params: Promise<{
    slug: string; // This will actually be the ID
  }>;
}

export default function ImpactDetailPage({ params }: PageProps) {
  const [card, setCard] = useState<ImpactCardType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { slug } = await params;
      try {
        const cards = await api.fetchImpactCards();
        // Find card by ID instead of by link
        const found = cards.find((c: ImpactCardType) => c.id.toString() === slug);
        setCard(found || null);
      } catch (e) {
        console.error(e);
        setCard(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  if (loading) return <div className="text-center text-primary-600 py-20">Loading...</div>;
  if (!card) return notFound();

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        {/* Subtle floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-primary-200 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl tracking-tight font-display font-bold text-foreground sm:text-5xl md:text-6xl">
              {card.title}
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              {card.description}
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: card.detailedDescription }}
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-hope-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
            Ready to Get Involved?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join our community and be part of the positive change we&apos;re creating together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-primary-600 text-white font-bold rounded-full shadow-warm hover:bg-primary-700 hover:shadow-warm-lg transition-all duration-300"
            >
              Register for remarriage
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-primary-600 text-primary-600 font-bold rounded-full shadow hover:bg-primary-50 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

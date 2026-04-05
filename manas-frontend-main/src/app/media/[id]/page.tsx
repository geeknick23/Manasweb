'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { MediaCardType } from '@/types/cards';

export default function MediaDetailPage() {
  const { id } = useParams();
  const [card, setCard] = useState<MediaCardType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cards = await api.fetchMediaCards();
        const found = cards.find((c: MediaCardType) => String(c._id || c.id) === id);
        setCard(found || null);
      } catch {
        setCard(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

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
              href="/media" 
              className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Media
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
          <div className="prose prose-lg max-w-none">
            <p className='text-slate-800'><strong>Date:</strong> {card.date}</p>
            <p className='text-slate-800'><strong>Source:</strong> {card.source}</p>
            <div 
              className="mt-6"
              dangerouslySetInnerHTML={{ __html: card.detailedDescription || card.description }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useEffect, useState, useRef } from 'react';
import { api } from '@/services/api';
import { MediaCardType } from '@/types/cards';
import MediaCard from '@/components/MediaCard';
import { Newspaper, Play, Camera } from 'lucide-react';

// Intersection observer hook
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold]);
  
  return { ref, isInView };
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'news' | 'video' | 'photo'>('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cards = await api.fetchMediaCards();
        setMedia(cards);
      } catch {
        setMedia([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredMedia =
    filter === 'all'
      ? media
      : media.filter((m) => {
          const t = m.type ?? 'press';
          if (filter === 'news') return t === 'press';
          return t === filter;
        });

  const filterButtons = [
    { key: 'all', label: 'All Media', icon: null },
    { key: 'news', label: 'News', icon: Newspaper },
    { key: 'video', label: 'Videos', icon: Play },
    { key: 'photo', label: 'Photos', icon: Camera },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        {/* Subtle floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-primary-200 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-800 text-sm font-semibold mb-6 shadow-sm border border-slate-200">
            <Newspaper className="text-primary w-4 h-4" />
            Featured in Media
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Media <span className="text-primary">Coverage</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our journey through news articles, videos, and photo galleries showcasing our impact and community events.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white py-8 shadow-card relative z-10 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { number: '50+', label: 'News Articles' },
              { number: '20+', label: 'Video Features' },
              { number: '100+', label: 'Event Photos' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-display font-bold gradient-text-warm">{stat.number}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter & Content */}
      <section className="py-16 bg-hope-light relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key as typeof filter)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  filter === btn.key
                    ? 'bg-primary-600 text-white shadow-warm'
                    : 'bg-white text-slate-700 hover:bg-primary-50 hover:text-primary-600 shadow-card'
                }`}
              >
                {btn.icon && <btn.icon className="w-4 h-4" />}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-card">
                  <div className="h-48 shimmer"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-20 shimmer rounded-full"></div>
                    <div className="h-6 w-3/4 shimmer rounded"></div>
                    <div className="h-4 shimmer rounded"></div>
                    <div className="h-4 w-2/3 shimmer rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
                <Newspaper className="text-4xl text-primary-400 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-3">
                {filter === 'all' ? 'No Media Coverage Yet' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Found`}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                We&apos;re constantly making an impact. Check back soon for the latest media coverage!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMedia.map((card, index) => (
                <MediaCardAnimated key={card.id} card={card} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <Newspaper className="w-16 h-16 text-primary-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-6">
            Press & Media Inquiries
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            For press inquiries, interviews, or media partnerships, please reach out to our communications team.
          </p>
          <a 
            href="mailto:manasfoundation2025@gmail.com"
            className="btn-primary"
          >
            Contact Press Team
            <svg className="inline-block ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}

// Animated media card wrapper
function MediaCardAnimated({ card, index }: { card: MediaCardType; index: number }) {
  const { ref, isInView } = useInView(0.1);
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <MediaCard card={card} />
    </div>
  );
}

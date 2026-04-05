'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ImpactCardType } from '../types/cards';
import { useState } from 'react';
import { getImageUrl } from '../services/api';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';

interface ImpactCardProps {
  card: ImpactCardType;
}

export default function ImpactCard({ card }: ImpactCardProps) {
  const [imageError, setImageError] = useState(false);
  const impactUrl = `/impact/${card.id || card._id}`;

  // Safely get image URL — fall back to placeholder if URL is invalid
  let imageUrl = '/images/no-profile-pic.svg';
  try {
    const rawUrl = getImageUrl(card.imageUrl);
    // Validate: must be a relative path or a parseable absolute URL
    if (rawUrl.startsWith('/')) {
      imageUrl = rawUrl;
    } else {
      new URL(rawUrl); // will throw if invalid
      imageUrl = rawUrl;
    }
  } catch {
    // Invalid URL, use fallback
  }

  return (
    <Card className="group overflow-hidden rounded-[2rem] bg-white border border-border/50 transition-all duration-500 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 h-full flex flex-col cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">📸</div>
              <div className="text-xs font-medium text-muted-foreground">{card.title}</div>
            </div>
          </div>
        )}

        {/* Gradient overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Category badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="backdrop-blur-md bg-black/40 text-white hover:bg-black/60 shadow-sm font-semibold border-none px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
            Impact Story
          </Badge>
        </div>
      </div>

      <CardHeader className="flex-none p-6 pb-2">
        <h3 className="font-display text-xl font-bold leading-tight line-clamp-2 transition-colors group-hover:text-primary text-slate-900">
          {card.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-grow px-6 pb-4">
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {card.description}
        </p>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0 mt-auto">
        <Link
          href={impactUrl}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 group/link min-h-[44px] focus-visible:outline-none focus-visible:underline"
        >
          Read Full Story
          <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </CardFooter>
    </Card>
  );
}

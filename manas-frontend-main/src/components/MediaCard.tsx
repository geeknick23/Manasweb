'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MediaCardType } from '../types/cards';
import { useState } from 'react';
import { FaPlay, FaNewspaper, FaCamera, FaExternalLinkAlt } from 'react-icons/fa';

const PLACEHOLDER_IMAGE = '/images/no-profile-pic.svg';

export default function MediaCard({ card }: { card: MediaCardType }) {
  const [imageError, setImageError] = useState(false);
  const truncated = card.description.length > 120 ? card.description.slice(0, 120) + '...' : card.description;
  const imageSrc =
    typeof card.imageUrl === 'string' && card.imageUrl.trim() !== '' ? card.imageUrl.trim() : PLACEHOLDER_IMAGE;
  
  const kind = card.type ?? 'press';

  const getTypeIcon = () => {
    switch (kind) {
      case 'video':
        return <FaPlay className="w-4 h-4" />;
      case 'photo':
        return <FaCamera className="w-4 h-4" />;
      case 'press':
      default:
        return <FaNewspaper className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (kind) {
      case 'video':
        return 'Video';
      case 'photo':
        return 'Photo Gallery';
      case 'press':
      default:
        return 'News Article';
    }
  };

  const getTypeColor = () => {
    switch (kind) {
      case 'video':
        return 'bg-red-500';
      case 'photo':
        return 'bg-emerald-600';
      case 'press':
      default:
        return 'bg-primary-500';
    }
  };

  return (
    <div className="group bg-white rounded-3xl shadow-card overflow-hidden card-hover">
      {/* Image section */}
      <div className="relative h-52 overflow-hidden">
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => {
              setImageError(true);
            }}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-50">
            <div className="text-center">
              <div className="text-5xl mb-2">📰</div>
              <div className="text-sm font-medium text-primary-600">{card.source}</div>
            </div>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"></div>
        
        {/* Type badge */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getTypeColor()} text-white text-xs font-semibold shadow-lg`}>
            {getTypeIcon()}
            {getTypeLabel()}
          </span>
        </div>
        
        {/* Video play button */}
        {kind === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <FaPlay className="w-6 h-6 text-primary-600 ml-1" />
            </div>
          </div>
        )}
        
        {/* Source on image */}
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-sm font-semibold text-white drop-shadow-lg">{card.source}</span>
        </div>
      </div>
      
      {/* Content section */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {card.date}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-display font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
          {card.title}
        </h3>
        
        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3">
          {truncated}
        </p>
        
        {/* CTA */}
        <div className="flex items-center justify-between">
          <Link
            href={`/media/${card._id || card.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-300 group/link"
          >
            {kind === 'video' ? 'Watch Video' : 'Read More'}
            <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          
          {card.externalUrl && (
            <a
              href={card.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
              aria-label="Open original source"
            >
              <FaExternalLinkAlt className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

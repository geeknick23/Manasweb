'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const heroSlides = [
  {
    src: '/images/hero/slide1.jpeg',
    alt: 'Mahila Parishad gathering and meeting',
    caption: 'Mahila Parishad',
  },
  {
    src: '/images/hero/slide2.jpeg',
    alt: 'Mahila Parishad community program',
    caption: 'Community Leadership',
  },
  {
    src: '/images/hero/slide3.jpg',
    alt: 'Rakshabandhan Program celebration',
    caption: 'Rakshabandhan Program',
  },
  {
    src: '/images/hero/slide4.jpeg',
    alt: 'Community celebration and Rakshabandhan',
    caption: 'Community Belonging',
  },
  {
    src: '/images/hero/slide5.jpg',
    alt: 'Samuhik Punavivah ceremony',
    caption: 'Samuhik Punavivah',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900">
      {/* Images */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-all ease-in-out duration-1000 ${index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority={index === 0}
            quality={90}
          />
        </div>
      ))}

      {/* Elegant Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-[1]" />

      {/* Slide Indicators */}
      <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center gap-3">
        {heroSlides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="p-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full group"
            aria-label={`Go to ${slide.caption}`}
          >
            <div className={`transition-all duration-300 rounded-full bg-white ${index === current
              ? 'w-8 h-2 opacity-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]'
              : 'w-2 h-2 opacity-40 group-hover:opacity-80'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

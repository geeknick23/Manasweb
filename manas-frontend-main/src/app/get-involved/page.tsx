'use client';

import Link from 'next/link';
import { Heart, BookOpen, Briefcase, HandHeart, MapPin, Calendar, Clock, Handshake, Users } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { api, type Event } from '@/services/api';

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

// CTA Card Component
function CTACard({ 
  icon: Icon, 
  iconColor, 
  bgGradient,
  title, 
  description, 
  buttonText, 
  buttonLink, 
  isDisabled,
  index 
}: {
  icon: React.ElementType;
  iconColor: string;
  bgGradient: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  isDisabled?: boolean;
  index: number;
}) {
  const { ref, isInView } = useInView(0.2);
  
  return (
    <div 
      ref={ref}
      className={`group bg-white rounded-3xl shadow-card card-hover p-8 flex flex-col relative overflow-hidden transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 ${bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Icon */}
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${iconColor} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="text-4xl text-white" />
        </div>
        
        {/* Content */}
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-4">{title}</h2>
        <p className="text-slate-600 leading-relaxed mb-8 flex-grow">{description}</p>
        
        {/* Button */}
        {isDisabled ? (
          <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-100 text-slate-500 font-semibold cursor-not-allowed">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {buttonText}
          </span>
        ) : (
          <Link 
            href={buttonLink || '#'}
            className="btn-primary text-center"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event, index }: { event: Event; index: number }) {
  const { ref, isInView } = useInView(0.2);
  
  return (
    <div 
      ref={ref}
      className={`group bg-white rounded-3xl shadow-card card-hover overflow-hidden flex flex-col md:flex-row transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Date sidebar */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 flex flex-row md:flex-col items-center justify-center md:w-28 gap-2 md:gap-0">
        <span className="text-4xl font-display font-bold">{event.month}</span>
        <span className="text-3xl font-bold">{event.day}</span>
      </div>
      
      {/* Content */}
      <div className="p-6 md:p-8 flex-grow flex flex-col">
        <h3 className="text-xl font-display font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors duration-300">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <p className="text-slate-600 text-sm flex items-center gap-2">
            <Calendar className="text-primary-500 w-4 h-4" />
            {new Date(event.date).toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-slate-600 text-sm flex items-center gap-2">
            <Clock className="text-primary-500 w-4 h-4" />
            {event.startTime} - {event.endTime}
          </p>
          <p className="text-slate-600 text-sm flex items-center gap-2">
            <MapPin className="text-primary-500 w-4 h-4" />
            {event.location}
          </p>
        </div>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
          {event.description}
        </p>
        
        {event.registerLink && event.registerLink.trim() !== '' ? (
          <Link
            href={event.registerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center w-full md:w-auto"
          >
            Register Now
            <svg className="inline-block ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-50 text-primary-700 font-semibold">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Registration Opening Soon
          </span>
        )}
      </div>
    </div>
  );
}

export default function GetInvolved() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  const ctaCards = [
    {
      icon: Heart,
      iconColor: 'from-primary-500 to-primary-600',
      bgGradient: 'bg-gradient-to-br from-primary-500 to-primary-600',
      title: 'Volunteer With Us',
      description: 'Become a volunteer and be part of our mission to empower women. Your time and skills can change lives and bring hope to those in need.',
      buttonText: 'Learn More',
      buttonLink: '/get-involved/volunteer',
    },
    {
      icon: BookOpen,
      iconColor: 'from-primary-400 to-primary-600',
      bgGradient: 'bg-gradient-to-br from-primary-400 to-primary-600',
      title: 'Share Your Problem',
      description: 'Facing a challenge or need support? Share your problem with us confidentially. Our team is here to listen and help you find the right resources.',
      buttonText: 'Share Now',
      buttonLink: '/contact',
    },
    {
      icon: Briefcase,
      iconColor: 'from-primary-500 to-primary-600',
      bgGradient: 'bg-gradient-to-br from-primary-500 to-primary-600',
      title: 'Apply For Job',
      description: 'We are working on new job opportunities to empower our community. Stay tuned for updates on how you can apply and become a part of our mission.',
      buttonText: 'Coming Soon',
      isDisabled: true,
    },
    {
      icon: HandHeart,
      iconColor: 'from-pink-500 to-pink-600',
      bgGradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
      title: 'Donate',
      description: 'Your donation helps us provide essential support, training, and resources to women in need. Every contribution makes a difference.',
      buttonText: 'Coming Soon',
      isDisabled: true,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-hope-light via-white to-primary-50"></div>
        <div className="absolute inset-0 hero-pattern"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 left-20 w-48 h-48 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-card text-sm font-medium text-primary-700 mb-6">
            <Users className="text-primary-500 w-4 h-4" />
            Join Our Community
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6">
            Get <span className="gradient-text">Involved</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join our mission to empower women and create meaningful connections. 
            There are many ways you can contribute to making a difference.
          </p>
        </div>
      </section>

      {/* CTA Cards Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ctaCards.map((card, index) => (
              <CTACard key={index} {...card} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15+', label: 'Districts Reached' },
              { number: '200+', label: 'Successful Matches' },
              { number: '50+', label: 'Active Volunteers' },
              { number: '2022', label: 'Serving since' },
            ].map((stat, index) => (
              <div key={index} className="group glass-card rounded-2xl p-6">
                <div className="text-4xl md:text-5xl font-display font-bold mb-2 text-white group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-hope-light relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              Events
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
              Upcoming <span className="gradient-text">Events</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join us at our upcoming events and be a part of the change
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-card flex min-h-[140px]">
                  <div className="w-28 shrink-0 self-stretch min-h-[140px] shimmer" aria-hidden />
                  <div className="p-8 flex-grow space-y-3">
                    <div className="h-6 w-3/4 shimmer rounded"></div>
                    <div className="h-4 w-1/2 shimmer rounded"></div>
                    <div className="h-4 w-2/3 shimmer rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.map((event, index) => (
                <EventCard key={event._id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-3">No Upcoming Events</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                We&apos;re planning exciting events. Check back soon or subscribe to our newsletter to stay updated!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <Handshake className="w-16 h-16 text-primary-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 mb-6">
            Every Contribution Matters
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Whether you volunteer your time, share your skills, or spread the word about our mission, 
            you&apos;re helping create a world where every woman has the opportunity to thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">
              Contact Us
              <svg className="inline-block ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/about" className="btn-secondary">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { GraduationCap, Puzzle, HeartHandshake, Scale, Target, Star } from 'lucide-react';
import { marketingPrograms, type MarketingProgramIcon } from '@/data/programs-marketing';

function programMarketingIcon(kind: MarketingProgramIcon) {
  const className = 'w-8 h-8 text-primary-600';
  switch (kind) {
    case 'graduation':
      return <GraduationCap className={className} />;
    case 'puzzle':
      return <Puzzle className={className} />;
    case 'heart-handshake':
      return <HeartHandshake className={className} />;
    case 'scale':
      return <Scale className={className} />;
  }
}

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

// Timeline item component
function TimelineItem({ date, title, description, index }: { 
  date: string; 
  title: string; 
  description: string;
  index: number;
}) {
  const { ref, isInView } = useInView(0.2);
  
  return (
    <div 
      ref={ref}
      className={`relative flex flex-col md:flex-row md:items-center gap-6 md:gap-12 transition-all duration-700 ${
        isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Date badge */}
      <div className="flex-shrink-0 md:w-40 md:text-right">
        <span className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-bold shadow-warm">
          {date}
        </span>
      </div>
      
      {/* Connector dot */}
      <div className="hidden md:block absolute left-[calc(10rem+1.5rem)] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-500 border-4 border-white shadow-lg z-10"></div>
      
      {/* Content card */}
      <div className="flex-1 bg-white rounded-3xl p-8 shadow-card card-hover border border-slate-100">
        <h3 className="text-2xl font-display font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Team member component
function TeamMember({ name, role, initials, index }: {
  name: string;
  role: string;
  initials: string;
  index: number;
}) {
  const { ref, isInView } = useInView(0.2);
  
  return (
    <div 
      ref={ref}
      className={`group bg-white rounded-3xl p-8 shadow-card card-hover border border-slate-100 text-center transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl font-bold text-white shadow-warm-lg group-hover:scale-105 transition-transform duration-300">
          {initials}
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center border-4 border-white">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-display font-bold text-slate-800 mb-1">{name}</h3>
      <div className="text-primary-600 font-semibold mb-2">{role}</div>
    </div>
  );
}

// Program card component
function ProgramCard({ icon, title, description, tags, index }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  index: number;
}) {
  const { ref, isInView } = useInView(0.2);
  
  return (
    <div 
      ref={ref}
      className={`group bg-white rounded-3xl p-8 shadow-card card-hover border border-slate-100 transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed mb-5">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span key={i} className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  const timeline = [
    { date: 'Aug 2022', title: 'Widow Women Rakshabandhan Program, Buldhana', description: 'Organized to celebrate Rakshabandhan with widowed women, fostering emotional support and social bonding.' },
    { date: 'Nov 2022', title: 'Entrepreneur & Business Meet, Buldhana', description: 'Aimed at creating employment opportunities and business connections for single women.' },
    { date: 'Dec 2023', title: 'Widow Women Parishad, Buldhana', description: 'A district-level gathering where widowed, divorced, and abandoned women voiced their concerns in a safe space.' },
    { date: 'Jan 2024', title: 'Remarriage Ceremony, Sindkhed Raja', description: 'A dignified group remarriage event held with community participation and traditional celebration.' },
    { date: 'Mar 2024', title: 'Community Remarriage Ceremony, Buldhana', description: 'Another collective remarriage event conducted in Buldhana, continuing the mission with equal enthusiasm.' },
  ];

  const team = [
    { name: 'Dattatraya Lahane', role: 'President', initials: 'DL' },
    { name: 'Ganesh Nikam', role: 'Vice President', initials: 'GN' },
    { name: 'Shahina Pathan', role: 'Treasurer', initials: 'SP' },
    { name: 'Meena Lahane', role: 'Secretary', initials: 'ML' },
  ];

  const aboutGalleryFeature = {
    src: '/images/about/community.jpg',
    alt: 'Women gathered together at a Jagruti Karyakram community programme',
    label: 'Community Gatherings',
  } as const;

  const aboutGalleryTiles = [
    {
      src: '/images/about/remarriage.jpg',
      alt: 'Couple in wedding attire receiving an envelope at a Samuhik Punavivah ceremony',
      label: 'Remarriage',
    },
    {
      src: '/images/about/recognition.jpg',
      alt: 'Mahila Parishad — women recognised on stage at a district event',
      label: 'Recognition',
    },
  ] as const;

  return (
    <>
      {/* Intro: headline, three-photo row, Our Story — one visual arc */}
      <section className="relative pt-28 pb-20 md:pb-28 overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div className="absolute -top-24 left-1/2 h-[28rem] w-[min(100%,56rem)] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-100/90 via-primary-50/40 to-transparent blur-3xl" />
          <div className="absolute bottom-0 right-[-10%] h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500 motion-safe:animate-pulse" />
              Established 2022
            </div>
            <h1 className="mb-5 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              About{' '}
              <span className="gradient-text">MANAS Foundation</span>
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Dedicated to empowering widows and divorced women through compassionate support, meaningful connections,
              and pathways to a dignified new beginning.
            </p>
          </header>

          {/* Bento layout: large community feature + two stacked moments */}
          <div className="mx-auto mb-16 max-w-6xl md:mb-20">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
              <div className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-[0_16px_48px_-16px_rgba(15,23,42,0.18)] sm:min-h-[300px] lg:col-span-7 lg:row-span-2 lg:min-h-[460px] lg:rounded-3xl">
                <Image
                  src={aboutGalleryFeature.src}
                  alt={aboutGalleryFeature.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/5" />
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-400 via-primary-500 to-primary-600 opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-8">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
                    On the ground
                  </p>
                  <p className="max-w-md font-display text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                    {aboutGalleryFeature.label}
                  </p>
                </div>
              </div>

              {aboutGalleryTiles.map((item) => (
                <div
                  key={item.src}
                  className="group relative min-h-[200px] overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-[0_12px_36px_-14px_rgba(15,23,42,0.16)] sm:min-h-[220px] lg:col-span-5 lg:min-h-0 lg:h-full lg:rounded-3xl"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-900/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <p className="font-display text-lg font-semibold text-white drop-shadow-md sm:text-xl">
                      {item.label}
                    </p>
                    <span
                      className="hidden shrink-0 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/95 backdrop-blur-sm sm:inline-block"
                      aria-hidden
                    >
                      MANAS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <article className="mx-auto max-w-3xl rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-8 shadow-[0_24px_64px_-24px_rgba(124,58,237,0.2),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-sm md:rounded-[2rem] md:p-12 lg:p-14">
            <div className="mb-8 text-center">
              <span className="mb-4 inline-flex rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-800">
                Our Story
              </span>
              <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">
                The Vision Behind MANAS
              </h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
            </div>

            <div className="space-y-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              <p>
                <span className="font-semibold text-slate-800">Manas Foundation</span> was established from the vision
                of <span className="font-semibold text-primary-600">Mr. D.S. Lahane</span>. From his childhood, having
                witnessed the suffering of widowed sisters, his mother, and his aunts at home, as well as injustices in
                society, he resolved to work in this field.
              </p>
              <p>
                In 2022, while preparing for a district council election candidacy, he organized for the first time at
                the district level a{' '}
                <span className="font-semibold text-slate-800">Rakshabandhan program specifically for women</span>, in
                which a large number of widowed women participated. Building on that social commitment, he then began
                work toward the remarriage of widowed, divorced, and separated women.
              </p>
              <p>
                Through ongoing programs, he continues to support women with{' '}
                <span className="font-semibold text-slate-800">employment pathways, training, and practical help</span>{' '}
                toward a renewed start in life.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="group relative bg-gradient-to-br from-primary-50 to-white rounded-4xl p-10 shadow-card card-hover border border-primary-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-8 shadow-warm group-hover:scale-105 transition-transform duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Our Mission</h2>
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  To empower widows and divorced women by providing dignified pathways to remarriage and companionship, creating a supportive community that breaks social stigmas.
                </p>
                <ul className="space-y-4">
                  {[
                    'To give new life and hope to widowed, divorced, and abandoned women in society.',
                    'To free women from traditional constraints and make them economically, socially, and emotionally self-reliant.',
                    'To provide all necessary opportunities, guidance, and support for women to lead a renewed life.',
                    'To help them gain dignity and respect in society through the path of remarriage.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Vision Card */}
            <div className="group relative bg-gradient-to-br from-primary-50 to-white rounded-4xl p-10 shadow-card card-hover border border-primary-100 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center mb-8 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Our Vision</h2>
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  A society where every woman, regardless of her past circumstances, has the opportunity to find love, companionship, and support in a judgment-free environment.
                </p>
                <ul className="space-y-4">
                  {[
                    'To transform societal attitudes by eliminating the stigma around widowhood and remarriage.',
                    'To build an inclusive society where every woman can live with respect and purpose.',
                    'To ensure systemic and policy-level support for the empowerment of single women.',
                    'To make remarriage a socially accepted norm that restores identity and equality.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Timeline Section */}
      <section className="py-24 bg-hope-light relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              Journey
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
              Our <span className="gradient-text">Story</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A journey of empowerment, transformation, and countless new beginnings
            </p>
          </div>
          
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-[calc(10rem+1.5rem-1px)] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200"></div>
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <TimelineItem key={index} {...item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              Leadership
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Dedicated leaders driving our mission forward with passion and purpose
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <TeamMember key={index} {...member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-24 bg-hope-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              What We Do
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 mb-4">
              Our Programs & <span className="gradient-text">Initiatives</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive support systems designed to empower and uplift
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketingPrograms.map((program, index) => (
              <ProgramCard
                key={program.id}
                icon={programMarketingIcon(program.icon)}
                title={program.title}
                description={program.description}
                tags={[...program.tags]}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

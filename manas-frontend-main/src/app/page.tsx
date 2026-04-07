import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, GraduationCap, Puzzle, HeartHandshake, Scale, ArrowRight } from 'lucide-react';
import { marketingPrograms, type MarketingProgramIcon } from '@/data/programs-marketing';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import ImpactCard from '@/components/ImpactCard';
import AchievementCard from '@/components/AchievementCard';
import SuccessStoryCard from '@/components/SuccessStoryCard';
import HeroCarousel from '@/components/HeroCarousel';
import { ImpactCardType, AchievementCardType, SuccessStoryType } from '@/types/cards';

export const revalidate = 60; // Revalidate at most every 60 seconds

const homeProgramIcons: Record<MarketingProgramIcon, typeof GraduationCap> = {
  graduation: GraduationCap,
  puzzle: Puzzle,
  'heart-handshake': HeartHandshake,
  scale: Scale,
};

export default async function Home() {
  const [impactCards, achievements, successStories] = await Promise.all([
    api.fetchImpactCards().catch((e) => {
      console.error(e);
      return [];
    }),
    api.fetchAchievementCards().catch((e) => {
      console.error(e);
      return [];
    }),
    api.fetchSuccessStories().catch((e) => {
      console.error(e);
      return [];
    }),
  ]);

  const aboutBullets = [
    'Skill Development',
    'Community Support',
    'Job Placement',
    'Legal Guidance',
  ];

  return (
    <>
      <section className="relative mx-auto flex min-h-[95vh] w-full items-center justify-center overflow-hidden pb-16 pt-40 fade-in-section">
        <div className="absolute inset-0 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
          <HeroCarousel />
        </div>

        <div className="relative z-30 mx-auto mt-10 flex w-full max-w-7xl flex-col items-center justify-between gap-12 md:flex-row">
          <div className="flex-1 animate-in space-y-8 delay-150 duration-700 fade-in slide-in-from-bottom-8">
            <div className="glass-card inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.6)]"></span>
              Hope, dignity, and community
            </div>

            <h1 className="font-display text-6xl font-bold leading-[1.05] tracking-tighter text-white drop-shadow-md sm:text-7xl lg:text-8xl">
              Rebuilding Lives, <br />
              <span className="bg-gradient-to-r from-primary to-primary-300 bg-clip-text font-bold italic text-transparent">
                Restoring Dignity.
              </span>
            </h1>

            <p className="max-w-xl text-lg font-light leading-relaxed text-white/80 sm:text-xl">
              MANAS Foundation works to empower widows and divorced women through
              <span className="font-medium text-white">
                {' '}
                skill development, community support, and social rehabilitation
              </span>
              .
            </p>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full border-none bg-primary px-8 text-base text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90"
              >
                <Link href="/get-involved">Support Our Mission</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="glass h-14 rounded-full border border-white/30 !bg-transparent px-8 text-base text-white outline-none transition-all duration-300 hover:bg-white/20"
              >
                <Link href="/about" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> About Us
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden flex-1 lg:block" />
        </div>
      </section>

      <section className="relative overflow-x-hidden py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="order-1 flex flex-col space-y-8">
              <div className="inline-flex w-max items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                About Us
              </div>
              <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Empowering Women to <br />
                <span className="italic text-primary">Rebuild Their Lives</span>
              </h2>
              <div className="space-y-6 text-lg font-light leading-relaxed text-muted-foreground">
                <p>
                  MANAS Foundation is a dedicated non-profit organization focused on the social and economic
                  rehabilitation of widows and divorced women. We believe every woman deserves a life of dignity,
                  financial independence, and emotional well-being.
                </p>
                <p>
                  Through skill development programs, community support networks, and vital resources, we help women
                  transition from vulnerability to strength. Our comprehensive approach ensures long-term sustainable
                  impact.
                </p>
              </div>

              <ul className="grid grid-cols-1 gap-x-6 gap-y-4 py-4 sm:grid-cols-2">
                {aboutBullets.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-base font-medium text-foreground">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="h-14 w-max rounded-full px-8 font-semibold tracking-wide shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href="/about">
                  Learn More About Us <ArrowRight className="ml-2 inline h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative order-2 mx-auto min-h-[520px] w-full max-w-xl pb-6 sm:min-h-[560px] lg:max-w-none lg:min-h-[500px]">
              <div className="group absolute right-0 top-0 z-[1] aspect-[4/3] w-[88%] overflow-hidden rounded-[2rem] border border-border shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] sm:w-[84%] lg:w-[82%]">
                <Image
                  src="/images/hero/about-jagruti-parishad.jpg"
                  alt="Vidhwa Parityakta Mahila Parishad — formal event on stage in Buldhana"
                  fill
                  className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized
                />
              </div>

              <div className="group absolute bottom-0 left-1/2 z-[2] aspect-[16/10] w-[92%] max-w-lg -translate-x-1/2 overflow-hidden rounded-[2rem] border-[7px] border-background shadow-[0_24px_50px_-12px_rgba(0,0,0,0.22)] sm:aspect-[16/9] sm:w-[88%] sm:max-w-2xl">
                <Image
                  src="/images/hero/about-mahila-parishad.jpg"
                  alt="Mahila Parishad — large indoor gathering, collective pledge"
                  fill
                  className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Our Impact in <span className="italic text-primary">Action.</span>
            </h2>
            <p className="text-lg font-light text-muted-foreground">
              Stories of resilience, courage, and new beginnings from the women we exist to serve.
            </p>
          </div>

          {impactCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {impactCards.slice(0, 6).map((card: ImpactCardType) => (
                <ImpactCard key={card.id || card._id} card={card} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-border bg-slate-50 p-12 text-center text-muted-foreground">
              No impact stories found at the moment.
            </div>
          )}
        </div>
      </section>

      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                Our Programs
              </div>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Meaningful <span className="italic text-primary">Initiatives.</span>
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-border px-6 font-medium transition-all duration-300 hover:bg-muted"
            >
              <Link href="/programs">View All Programs</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {marketingPrograms.map((program) => {
              const Icon = homeProgramIcons[program.icon];
              return (
                <Link key={program.id} href={program.href} className="group block h-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card p-10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-xl">
                    <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[100px] bg-primary/5 transition-transform duration-500 group-hover:scale-110" />
                    <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-3 font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                      {program.title}
                    </h3>
                    <p className="mb-5 flex-1 text-[15px] font-light leading-relaxed text-muted-foreground sm:text-base">
                      {program.description}
                    </p>
                    <div className="mb-6 flex flex-wrap gap-2">
                      {program.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
                      Explore <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Milestones & <span className="italic text-primary">Achievements</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {achievements.map((achievement: AchievementCardType, index: number) => (
              <AchievementCard key={index} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Voices of <span className="italic text-primary">Change.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {successStories.slice(0, 4).map((story: SuccessStoryType, index: number) => (
              <SuccessStoryCard key={index} story={story} index={index} />
            ))}
            {successStories.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground">
                No success stories found at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative m-4 overflow-hidden rounded-[3rem] py-32 sm:m-8 lg:m-12">
        <div className="absolute inset-0 bg-primary"></div>
        <div className="absolute right-0 top-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary opacity-30 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/3 rounded-full bg-primary opacity-20 blur-[80px]"></div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 font-display text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Be the Catalyst <br />
            for <span className="font-bold italic text-white">Change.</span>
          </h2>
          <p className="mb-12 max-w-2xl text-xl font-light leading-relaxed text-white/80">
            Your support can transform a life. Whether through volunteering your time or making a donation, you enable
            us to provide critical resources to women striving for independence.
          </p>

          <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-16 w-full rounded-full bg-white px-12 text-lg font-semibold text-primary shadow-xl shadow-black/10 transition-all duration-300 hover:scale-105 hover:bg-white/90 sm:w-auto"
            >
              <Link href="/get-involved/donate">Make a Donation</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="glass h-16 w-full rounded-full border border-white/30 !bg-transparent px-12 text-lg font-semibold text-white outline-none transition-all duration-300 hover:bg-white/20 sm:w-auto"
            >
              <Link href="/get-involved/volunteer">Become a Volunteer</Link>
            </Button>
          </div>

          <p className="mt-12 text-sm font-medium uppercase tracking-wide text-white/50">
            All donations are tax-deductible under Section 80G of the Income Tax Act.
          </p>
        </div>
      </section>
    </>
  );
}

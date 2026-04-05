'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'navbar' | 'footer' | 'auth';

/** Gradient “plate” behind the mark — brand violet with soft highlight. */
const plateNavbar =
  'bg-gradient-to-br from-primary-100 via-white to-violet-100/90 shadow-[0_4px_16px_-4px_rgba(124,58,237,0.35)] ring-2 ring-primary-300/60 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(ellipse_80%_60%_at_35%_15%,rgba(255,255,255,0.85),transparent_58%)]';

const plateAuth =
  'bg-gradient-to-br from-primary-50 via-white to-primary-100/95 shadow-[0_6px_20px_-6px_rgba(124,58,237,0.3)] ring-2 ring-primary-200/70 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(ellipse_75%_55%_at_40%_12%,rgba(255,255,255,0.9),transparent_55%)]';

/** Rich violet plate for dark footer — reads as intentional brand chrome. */
const plateFooter =
  'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-900 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.45)] ring-2 ring-white/25 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(ellipse_70%_50%_at_30%_10%,rgba(255,255,255,0.22),transparent_50%)]';

const variantConfig: Record<
  Variant,
  { box: string; plate: string; sizes: string; wordmarkTitle: string; wordmarkSub: string }
> = {
  navbar: {
    box: 'h-10 w-10 rounded-xl',
    plate: plateNavbar,
    sizes: '40px',
    wordmarkTitle: 'text-xl font-display font-bold tracking-tight text-primary',
    wordmarkSub: 'text-xs font-semibold tracking-wider uppercase text-muted-foreground',
  },
  footer: {
    box: 'h-11 w-11 rounded-xl',
    plate: plateFooter,
    sizes: '44px',
    wordmarkTitle: 'text-xl font-display font-bold text-white',
    wordmarkSub: 'text-xs text-slate-400',
  },
  auth: {
    box: 'h-14 w-14 rounded-2xl',
    plate: plateAuth,
    sizes: '56px',
    wordmarkTitle: 'text-xl font-display font-bold text-primary-700',
    wordmarkSub: 'text-xs text-slate-500',
  },
};

type ManasLogoProps = {
  variant?: Variant;
  /** When false, only the mark (no “MANAS Foundation” text). */
  showWordmark?: boolean;
  className?: string;
  priority?: boolean;
};

const markDefaultPlate =
  'bg-gradient-to-br from-primary-100 via-white to-violet-100/90 shadow-md shadow-primary/20 ring-2 ring-primary-300/55 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(ellipse_80%_60%_at_35%_15%,rgba(255,255,255,0.75),transparent_55%)]';

/** Square mark only (e.g. pills, badges). Uses aria-hidden — pair with visible text nearby. */
export function ManasLogoMark({
  className = 'h-8 w-8 rounded-lg',
  sizes = '32px',
  /** Use on dark / purple panels (e.g. login hero). */
  onDarkPanel,
}: {
  className?: string;
  sizes?: string;
  onDarkPanel?: boolean;
}) {
  const plate = onDarkPanel
    ? 'bg-gradient-to-br from-white via-primary-50/90 to-primary-100/80 shadow-2xl shadow-black/20 ring-2 ring-white/45 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(ellipse_70%_50%_at_35%_12%,rgba(255,255,255,0.95),transparent_52%)]'
    : markDefaultPlate;

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden transition-transform duration-300',
        plate,
        className
      )}
      aria-hidden
    >
      <Image
        src="/images/logo.png"
        alt=""
        fill
        className="relative z-[1] object-contain p-[3px]"
        sizes={sizes}
      />
    </div>
  );
}

export default function ManasLogo({
  variant = 'navbar',
  showWordmark = true,
  className = '',
  priority,
}: ManasLogoProps) {
  const v = variantConfig[variant];
  const isPriority = priority ?? variant === 'navbar';

  return (
    <Link
      href="/"
      className={cn('group flex shrink-0 items-center gap-3', className)}
    >
      <div
        className={cn(
          'relative shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105',
          v.box,
          v.plate
        )}
      >
        <Image
          src="/images/logo.png"
          alt="MANAS Foundation"
          fill
          className="relative z-[1] object-contain p-[3px]"
          sizes={v.sizes}
          priority={isPriority}
        />
      </div>
      {showWordmark ? (
        <div className="flex min-w-0 flex-col text-left">
          <span className={v.wordmarkTitle}>MANAS Foundation</span>
          <span className={v.wordmarkSub}>Empowering Lives</span>
        </div>
      ) : null}
    </Link>
  );
}

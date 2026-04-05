import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Programs | MANAS Foundation',
  description:
    'Skill development, community support, and legal awareness programs for widows and divorced women.',
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

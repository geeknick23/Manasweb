import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skill Development | MANAS Foundation',
  description: 'Vocational training and employment support for women rebuilding their livelihoods.',
};

export default function SkillsProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

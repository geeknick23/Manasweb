import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Support | MANAS Foundation',
  description: 'Safe spaces, peer support, and community events for women MANAS serves.',
};

export default function CommunityProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Awareness | MANAS Foundation',
  description:
    'Legal rights education and guidance for women navigating property, custody, and social systems.',
};

export default function LegalProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** Shared copy for “Our programs” cards (home + about). */
export const marketingPrograms = [
  {
    id: 'skills',
    title: 'Empowerment Through Skills',
    description:
      'Skills training program helping women develop employable skills for financial independence.',
    tags: ['Training', 'Employment'],
    href: '/programs/skills',
    icon: 'graduation' as const,
  },
  {
    id: 'support',
    title: 'On-Ground Assistance & Support',
    description:
      'Practical help to address challenges from in-laws, family, and societal pressures.',
    tags: ['Ongoing support'],
    href: '/programs/community',
    icon: 'puzzle' as const,
  },
  {
    id: 'matchmaking',
    title: 'Matchmaking Platform',
    description: 'Secure online platform for meaningful connections and finding life partners.',
    tags: ['Ongoing service'],
    href: '/register',
    icon: 'heart-handshake' as const,
  },
  {
    id: 'legal',
    title: 'Legal Aid Support',
    description: 'Legal assistance and guidance for critical matters including property and custody.',
    tags: ['Case-by-case'],
    href: '/programs/legal',
    icon: 'scale' as const,
  },
] as const;

export type MarketingProgramIcon = (typeof marketingPrograms)[number]['icon'];

export interface ImpactDetailCard {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  date?: string;
  location?: string;
  participants?: number;
  // Detailed page information
  detailedContent: {
    heroImage: string;
    heroImageAlt: string;
    fullDescription: string;
    objectives: string[];
    outcomes: string[];
    testimonials: {
      quote: string;
      author: string;
      role: string;
      location: string;
    }[];
    gallery: {
      imageUrl: string;
      imageAlt: string;
      caption: string;
    }[];
    statistics: {
      label: string;
      value: string;
      description: string;
    }[];
    relatedPrograms: string[];
    contactInfo: {
      email: string;
      phone: string;
      address: string;
    };
  };
} 
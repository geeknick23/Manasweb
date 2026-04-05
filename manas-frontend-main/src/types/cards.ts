// Impact Card Interface
export interface ImpactCardType {
  _id?: string;
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  detailedDescription: string; // HTML content for the detailed page
}

// Achievement Card Interface
export interface AchievementCardType {
  id: number;
  icon: string;
  number: string;
  title: string;
  description: string;
}

// Success Story Interface
export interface SuccessStoryType {
  id: number;
  quote: string;
  author: string;
  location: string;
}

// Media Card Interface
export interface MediaCardType {
  _id?: string;
  id: number;
  title: string;
  date: string;
  source: string;
  description: string;
  imageUrl: string;
  detailedDescription: string;
  /** press = news article; used by /media filters */
  type?: 'press' | 'video' | 'photo';
  externalUrl?: string;
  /** Backend field; mapped to externalUrl in normalizeMediaCard */
  articleUrl?: string;
} 
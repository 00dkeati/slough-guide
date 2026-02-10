export interface Business {
  slug: string;
  name: string;
  imageUrl?: string;
  logoUrl?: string;
  rating?: number;
  reviewCount?: number;
  category: string;
  area: string;
  shortUSP?: string;
  description?: string;
  phone?: string;
  website?: string;
  address?: string;
  featured?: boolean;
}

export interface Article {
  slug: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  publishedAt?: string; // ISO
  kicker?: string;
  category?: string;
  author?: string;
  featured?: boolean;
  readTime?: number;
}

export interface Category { 
  slug: string; 
  label: string; 
  icon?: string;
  name?: string;
  description?: string;
}

export interface Area { 
  slug: string; 
  label: string; 
  blurb?: string;
  name?: string;
}

export interface Tile {
  label: string;
  href: string;
  icon?: string;
  blurb?: string;
}

export interface NewsCardSize {
  size: 'xl' | 'md' | 'sm';
}

export interface BusinessCardProps {
  item: Business;
}

export interface NewsCardProps extends NewsCardSize {
  article: Article;
}

export interface TileCardProps {
  tile: Tile;
}

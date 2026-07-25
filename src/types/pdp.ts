/**
 * Chouhan Mattress - PDP (Product Detail Page) Types
 */

import { Product } from '@/types';

export interface ProductVariantOption {
  id: string;
  size?: 'Single' | 'Double' | 'Queen' | 'King' | 'Custom';
  dimensions?: string; // e.g. "72 x 78 in"
  thickness?: '5 Inch' | '6 Inch' | '8 Inch' | '10 Inch';
  color?: string;
  fabric?: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface CustomDimension {
  lengthInches: number;
  widthInches: number;
  thickness: number;
}

export interface PincodeServiceability {
  pincode: string;
  isServiceable: boolean;
  estimatedDays: number;
  estimatedDateString: string;
  freeShipping: boolean;
  cashOnDelivery: boolean;
  freeInstallation: boolean;
}

export interface ProductSpecification {
  group: string;
  items: Array<{
    label: string;
    value: string;
  }>;
}

export interface ProductReview {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  variantPurchased?: string;
  helpfulCount: number;
  images?: string[];
}

export interface RatingBreakdown {
  average: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
  recommendPercentage: number;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

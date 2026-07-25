/**
 * Chouhan Mattress - Verified Buyer Reviews & Star Distribution Component for PDP
 */

'use client';

import React, { useState } from 'react';
import { StarIcon, ThumbsUpIcon, CheckCircle2Icon, FilterIcon } from 'lucide-react';
import { ProductReview, RatingBreakdown } from '@/types/pdp';
import { cn } from '@/lib/utils';

interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  className?: string;
}

const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    userName: 'Rajesh Sharma',
    userCity: 'New Delhi',
    rating: 5,
    date: '2024-02-10',
    title: 'Transformed my back pain within a week!',
    comment: 'I was hesitant about buying a mattress online, but the 100-night trial gave me confidence. The memory foam support is exceptional. My lower back pain has completely disappeared.',
    verifiedPurchase: true,
    variantPurchased: 'King Size / 8 Inch',
    helpfulCount: 42,
  },
  {
    id: 'rev-2',
    userName: 'Priya Venkatesh',
    userCity: 'Bangalore',
    rating: 5,
    date: '2024-02-04',
    title: 'Zero motion disturbance is 100% real',
    comment: 'My husband tosses and turns at night, but with this Chouhan mattress, I don’t feel a thing! High quality knit fabric and free installation was super fast.',
    verifiedPurchase: true,
    variantPurchased: 'Queen Size / 6 Inch',
    helpfulCount: 28,
  },
  {
    id: 'rev-3',
    userName: 'Amitav Roy',
    userCity: 'Kolkata',
    rating: 4,
    date: '2024-01-22',
    title: 'Great value for factory direct price',
    comment: 'Solid build quality. A bit firmer than I expected initially, but after 3 nights it adjusted perfectly. Highly recommended for daily comfort.',
    verifiedPurchase: true,
    variantPurchased: 'Double Size / 8 Inch',
    helpfulCount: 15,
  },
];

export function ReviewsSection({
  rating = 4.6,
  reviewCount = 1840,
  reviews = MOCK_REVIEWS,
  className,
}: ReviewsSectionProps) {
  const [filterRating, setFilterRating] = useState<number>(0);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});

  const handleHelpful = (id: string) => {
    setHelpfulMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const filteredReviews = reviews.filter((r) =>
    filterRating === 0 ? true : r.rating === filterRating
  );

  return (
    <div className={cn('bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xs', className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Verified Buyer Reviews</h3>
          <p className="text-sm text-gray-500 mt-1">Real feedback from real customers sleeping on Chouhan Mattress.</p>
        </div>

        {/* Overall Rating Box */}
        <div className="flex items-center gap-4 bg-orange-50/60 p-4 rounded-2xl border border-orange-100 self-start md:self-auto">
          <div className="text-center">
            <span className="text-3xl font-extrabold text-gray-900 leading-none">{rating}</span>
            <span className="text-xs text-gray-500 block mt-1">out of 5</span>
          </div>
          <div className="h-10 w-px bg-orange-200" />
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700 block mt-1">
              Based on {reviewCount.toLocaleString()} verified ratings
            </span>
          </div>
        </div>
      </div>

      {/* Filter by star rating */}
      <div className="flex items-center gap-2 py-4 border-b border-gray-100 overflow-x-auto">
        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
          <FilterIcon className="w-3.5 h-3.5" /> Filter:
        </span>
        {[0, 5, 4, 3].map((star) => (
          <button
            key={star}
            onClick={() => setFilterRating(star)}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-full border transition-all',
              filterRating === star
                ? 'bg-[#F26522] text-white border-[#F26522]'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
            )}
          >
            {star === 0 ? 'All Reviews' : `${star}★ Stars`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-100">
        {filteredReviews.map((rev) => {
          const currentHelpful = rev.helpfulCount + (helpfulMap[rev.id] || 0);
          return (
            <div key={rev.id} className="py-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#F26522] text-white font-bold text-sm flex items-center justify-center">
                    {rev.userName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-sm block">{rev.userName}</span>
                    <span className="text-xs text-gray-400">{rev.userCity}</span>
                  </div>
                </div>

                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                    <CheckCircle2Icon className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      className={cn('w-3.5 h-3.5', s <= rev.rating ? 'fill-amber-400' : 'text-gray-200')}
                    />
                  ))}
                </div>
                {rev.variantPurchased && (
                  <span className="text-xs text-gray-400 font-medium">| {rev.variantPurchased}</span>
                )}
              </div>

              {rev.title && <h4 className="font-bold text-gray-900 text-sm md:text-base">{rev.title}</h4>}
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{rev.comment}</p>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(rev.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>

                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#F26522] transition-colors font-medium"
                >
                  <ThumbsUpIcon className="w-3.5 h-3.5" />
                  <span>Helpful ({currentHelpful})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewsSection;

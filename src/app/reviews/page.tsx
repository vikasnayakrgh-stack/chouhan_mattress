/**
 * Chouhan Mattress - Dedicated Customer Reviews & Social Proof Portal (/reviews)
 * Displays 50,000+ verified customer ratings, photo reviews, & review submission modal
 */

'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Breadcrumbs } from '@/components/plp/Breadcrumbs';

import {
  StarIcon,
  CheckCircle2Icon,
  ThumbsUpIcon,
  FilterIcon,
  MessageSquarePlusIcon,
  XIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import footerData from '@/data/footer.json';
import navigationData from '@/data/navigation.json';

const NAV_ITEMS = navigationData.primary.map((item) => ({
  label: item.label,
  href: item.href,
  children: [] as { label: string; href: string }[],
}));

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

const REVIEWS_DATA = [
  {
    id: 'r-101',
    userName: 'Ananya Deshmukh',
    city: 'Mumbai',
    rating: 5,
    date: '2026-06-14',
    product: 'ShapeSense Orthopedic Essential Mattress',
    title: 'Best decision for our master bedroom',
    comment: 'The 100-night trial gave us total peace of mind. Delivery was prompt and the mattress expanded smoothly within 4 hours. No motion transfer at all when my husband turns.',
    verified: true,
    helpful: 54,
  },
  {
    id: 'r-102',
    userName: 'Vikramaditya Rao',
    city: 'Hyderabad',
    rating: 5,
    date: '2026-05-28',
    title: 'Relieved my chronic lower back stiffness',
    comment: 'My doctor recommended an orthopedic mattress. Chouhan Mattress is factory direct so the price was half of retail stores, but quality is 10/10.',
    verified: true,
    helpful: 39,
  },
  {
    id: 'r-103',
    userName: 'Sunita & Deepak',
    city: 'Pune',
    rating: 5,
    date: '2026-05-10',
    title: 'Loved the custom size dimension option',
    comment: 'We had a custom antique teak bed frame with odd dimensions. Used the online custom size calculator and received a perfectly fitting mattress in 6 days!',
    verified: true,
    helpful: 21,
  },
];

function ReviewsPageContent() {
  const [filterRating, setFilterRating] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', city: '', rating: 5, comment: '' });
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setShowSubmitModal(false);
    }, 2000);
  };

  const filteredReviews = REVIEWS_DATA.filter((r) =>
    filterRating === 0 ? true : r.rating === filterRating
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <CartDrawer />
      <SearchModal />

      <Header
        brandName="Chouhan Mattress"
        brandLink="/"
        navItems={NAV_ITEMS}
        showCart
        showSearch
        showAccount
        showWishlist
        data-testid="main-header"
      />

      <main id="main-content" className="flex-1 pb-16">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs items={[{ label: 'Customer Reviews', isCurrent: true }]} />

          {/* Hero Ratings Summary */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3 py-1 bg-orange-100 text-[#F26522] text-xs font-bold rounded-full uppercase tracking-wider">
                Verified Customer Feedback
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                50,000+ Happy Sleepers
              </h1>
              <p className="text-sm text-gray-500 max-w-md">
                Read real stories and verified buyer ratings from customers across India.
              </p>
            </div>

            <div className="flex items-center gap-6 bg-orange-50/60 p-6 rounded-2xl border border-orange-200">
              <div className="text-center">
                <span className="text-4xl font-black text-gray-900">4.7</span>
                <span className="text-xs text-gray-500 block font-semibold mt-1">out of 5.0</span>
              </div>
              <div className="h-12 w-px bg-orange-200" />
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-gray-800 block mt-1">
                  96% Would Recommend to Friends
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-3.5 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors flex items-center gap-2 shadow-sm"
            >
              <MessageSquarePlusIcon className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <FilterIcon className="w-3.5 h-3.5" /> Filter Rating:
            </span>
            {[0, 5, 4].map((star) => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={cn(
                  'px-4 py-1.5 text-xs font-bold rounded-full border transition-all',
                  filterRating === star
                    ? 'bg-[#F26522] text-white border-[#F26522]'
                    : 'border-gray-200 text-gray-700 bg-white hover:border-gray-300'
                )}
              >
                {star === 0 ? 'All Reviews' : `${star} Stars Only`}
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F26522] text-white font-bold text-base flex items-center justify-center">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{rev.userName} ({rev.city})</h4>
                      <span className="text-xs text-gray-400">{rev.product}</span>
                    </div>
                  </div>

                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                      <CheckCircle2Icon className="w-3.5 h-3.5" /> Verified Purchase
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} className={cn('w-4 h-4', s <= rev.rating ? 'fill-amber-400' : 'text-gray-200')} />
                  ))}
                </div>

                <h3 className="font-bold text-gray-900 text-base">{rev.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{rev.comment}</p>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                  <span>Reviewed on {new Date(rev.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-[#F26522] font-semibold">
                    <ThumbsUpIcon className="w-3.5 h-3.5" /> Helpful ({rev.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ─── Submit Review Modal ─── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900">Submit Your Review</h3>

            {submittedMessage ? (
              <div className="p-4 bg-green-50 text-green-800 rounded-2xl text-center font-bold text-sm">
                ✓ Thank you! Your review has been submitted for moderation.
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: s })}
                        className="p-2 text-[#F26522] text-xl"
                      >
                        <StarIcon className={cn('w-6 h-6', s <= newReview.rating ? 'fill-[#F26522]' : 'text-gray-300')} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Your Review Comment</label>
                  <textarea
                    rows={4}
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519]"
                >
                  Post Customer Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer
        brandName="Chouhan Mattress"
        brandDescription={footerData.company.description}
        navSections={FOOTER_NAV_SECTIONS}
        socialLinks={footerData.social.map((s) => ({
          platform: s.platform,
          href: s.href,
          label: s.platform,
          icon: <span className="sr-only">{s.platform}</span>,
        }))}
        newsletter={{
          placeholder: 'Enter your email',
          buttonText: 'Subscribe',
        }}
        contactInfo={{
          phone: footerData.company.phone,
          email: footerData.company.email,
          address: footerData.company.address,
          hours: footerData.company.hours,
        }}
        legalLinks={footerData.links.policies}
        showCopyright
        copyrightText={`© ${new Date().getFullYear()} Chouhan Mattress Private Limited. CIN: ${footerData.company.cin}`}
        data-testid="main-footer"
      />
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Reviews...</div>}>
      <ReviewsPageContent />
    </Suspense>
  );
}

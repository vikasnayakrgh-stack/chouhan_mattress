/**
 * Chouhan Mattress - Homepage
 * Phase 2A: Assembled from Phase 1 library components with real data from src/data/
 */

'use client';

import React, { Suspense } from 'react';
import { Header } from '@/components/library/Header';
import { Hero } from '@/components/library/Hero';
import { CategoriesSection } from '@/components/library/CategoriesSection';
import { WhyChooseUsSection } from '@/components/library/WhyWakefitSection';
import { TopSellingProductsSection } from '@/components/library/TopSellingProductsSection';
import { TestimonialsSection } from '@/components/library/TestimonialsSection';
import { Footer } from '@/components/library/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';

// Data imports
import homepageData from '@/data/homepage.json';
import testimonialsData from '@/data/testimonials.json';
import footerData from '@/data/footer.json';
import navigationData from '@/data/navigation.json';

// ─── Static data mappings ────────────────────────────────────────────────────

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

const currentSlide = homepageData.hero.slides[0];

const TRUST_BADGES = homepageData.hero.trustBadges;

// Map features — WhyChooseUsSection resolves icon strings internally
// Strip "Icon" suffix so keys match iconComponents map in WhyWakefitSection ('StarIcon' → 'Star')
const WHY_FEATURES = homepageData.whyWakefit.features.map((f) => ({
  icon: f.icon.replace(/Icon$/, '') as unknown as React.ReactNode,
  title: f.title,
  description: f.description,
  highlight: f.highlight,
}));

const TOP_PRODUCTS = homepageData.topSelling.products.map((p) => ({
  id: String(p.id),
  name: p.name,
  slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  primaryImage: p.image,
  description: p.shortDesc,
  price: p.price,
  originalPrice: p.originalPrice,
  discount: p.discount,
  rating: p.rating,
  reviewCount: p.reviewCount,
  thumbnail: p.image,
  images: [p.image],
  href: p.href,
  badges: p.badges?.map((b: string) => ({
    text: b,
    variant: b.includes('%') ? ('warning' as const) : ('primary' as const),
  })),
  inStock: true,
  category: p.type,
  delivery: 'Free',
}));

// ─── Page Component ──────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Global Interactive Components (self-managing state) */}
      <CartDrawer />
      <SearchModal />

      {/* ─── Header ─── */}
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

      <main id="main-content">
        {/* ─── Hero Section ─── */}
        <Hero
          title={currentSlide.title}
          subtitle={currentSlide.subtitle}
          backgroundImage={currentSlide.backgroundImage}
          ctaPrimary={{ text: currentSlide.ctaText, href: currentSlide.ctaLink }}
          ctaSecondary={{ text: 'Explore All Products', href: '/products' }}
          countdown={currentSlide.countdown}
          height="tall"
          badges={[
            { text: '100 Night Trial', variant: 'success' },
            { text: 'Free Shipping', variant: 'secondary' },
            { text: '10 Year Warranty', variant: 'warning' },
          ]}
          data-testid="homepage-hero"
        />

        {/* ─── Trust Badges Bar ─── */}
        <div
          className="bg-[#121212] text-white py-4"
          aria-label="Our promises"
          role="region"
        >
          <div className="container mx-auto px-4">
            <ul className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-16 list-none">
              {TRUST_BADGES.map((badge) => (
                <li key={badge.title} className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-full bg-[#F26522]/20 flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4 text-[#F26522]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white leading-tight">{badge.title}</div>
                    <div className="text-xs text-gray-400 leading-tight">{badge.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Categories Section ─── */}
        <CategoriesSection
          data={{
            headline: homepageData.categories.headline,
            subheadline: homepageData.categories.subheadline,
            description: homepageData.categories.description,
            items: homepageData.categories.items,
            cta: homepageData.categories.cta,
          }}
          data-testid="categories-section"
        />

        {/* ─── Top Selling Products ─── */}
        <TopSellingProductsSection
          headline={homepageData.topSelling.headline}
          subheadline={homepageData.topSelling.subheadline}
          products={TOP_PRODUCTS}
          showViewAll
          viewAllHref="/products"
          viewAllText="View All Products"
          data-testid="top-selling-section"
        />

        {/* ─── Why Chouhan Mattress ─── */}
        <WhyChooseUsSection
          data={{
            headline: homepageData.whyWakefit.headline,
            subheadline: homepageData.whyWakefit.subheadline,
            description: homepageData.whyWakefit.description,
            features: WHY_FEATURES,
            stats: homepageData.whyWakefit.stats,
          }}
          data-testid="why-section"
        />

        {/* ─── Promo Banner ─── */}
        <section
          className="py-5 px-4 bg-gradient-to-r from-[#F26522] to-[#E0581A]"
          aria-label="Promotional offer"
        >
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white text-center sm:text-left">
            <div>
              <p className="text-xl font-bold">🎉 Home Sweet Home Sale — Up to 65% OFF</p>
              <p className="text-sm opacity-90">
                Use code <strong>HOME</strong> for additional 11% OFF + Bank Offers
              </p>
            </div>
            <a
              href="/offers"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#F26522] font-bold rounded-xl hover:bg-orange-50 transition-colors duration-200 text-sm"
            >
              Shop Offers
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>

        {/* ─── Testimonials ─── */}
        <TestimonialsSection
          testimonials={testimonialsData.testimonials}
          summary={testimonialsData.summary}
          data-testid="testimonials-section"
        />

        {/* ─── Sleep Features Highlight ─── */}
        <section className="py-20 bg-gray-50" aria-labelledby="sleep-features-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 id="sleep-features-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Engineered for <span className="text-[#F26522]">Perfect Sleep</span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Every Chouhan Mattress is built with sleep science at the core — so you wake up genuinely refreshed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Ergonomic Spine Alignment',
                  description: 'Our orthopedic foam layers distribute body weight across 7 pressure zones, maintaining natural spinal curvature all night.',
                  colorClass: 'text-blue-600',
                  bgClass: 'bg-blue-50',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
                {
                  title: 'Advanced Cooling Technology',
                  description: 'Open-cell breathable foam + airflow channels regulate body temperature so you sleep cool even in Indian summers.',
                  colorClass: 'text-teal-600',
                  bgClass: 'bg-teal-50',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  ),
                },
                {
                  title: 'Zero Partner Disturbance',
                  description: 'Motion isolation technology absorbs movement so you and your partner sleep undisturbed all night long.',
                  colorClass: 'text-[#F26522]',
                  bgClass: 'bg-orange-50',
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  ),
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgClass} ${feature.colorClass} mb-5`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA Section ─── */}
        <section className="py-24 bg-[#121212] relative overflow-hidden" aria-labelledby="final-cta-heading">
          {/* Decorative glow */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#F26522] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F26522] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <span className="inline-block px-4 py-1.5 bg-[#F26522]/20 text-[#F26522] text-sm font-semibold rounded-full mb-6 tracking-wide uppercase">
              Risk-Free Trial
            </span>
            <h2 id="final-cta-heading" className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Try for 100 Nights.
              <br />
              <span className="text-[#F26522]">Love it or Full Refund.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
              No questions asked. Free pickup. Full refund. That is how confident we are that you will love your Chouhan Mattress.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F26522] text-white font-bold rounded-xl hover:bg-[#D95318] transition-colors duration-200 text-base"
              >
                Shop Mattresses
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/mattress-selector"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white hover:bg-white/5 transition-all duration-200 text-base"
              >
                Find My Mattress
              </a>
            </div>
            <p className="mt-8 text-sm text-gray-500">
              ✓ Free Shipping &nbsp;&nbsp; ✓ Free Installation &nbsp;&nbsp; ✓ 10-Year Warranty &nbsp;&nbsp; ✓ EMI Starting ₹500/mo
            </p>
          </div>
        </section>
      </main>

      <Footer
        brandName="Chouhan Mattress"
        brandDescription={footerData.company.description}
        navSections={FOOTER_NAV_SECTIONS}
        socialLinks={footerData.social.map((s) => ({
          platform: s.platform,
          href: s.href,
          label: s.platform,
          icon: (
            <span className="sr-only">{s.platform}</span>
          ),
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

/**
 * Chouhan Mattress - Homepage
 * Built directly from official Wakefit design architecture benchmark
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Hero } from '@/components/library/Hero';
import { CategoriesSection } from '@/components/library/CategoriesSection';
import { WhyChooseUsSection } from '@/components/library/WhyWakefitSection';
import { TopSellingProductsSection } from '@/components/library/TopSellingProductsSection';
import { TestimonialsSection } from '@/components/library/TestimonialsSection';
import { Footer } from '@/components/library/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MessageSquarePlusIcon } from 'lucide-react';

// Data imports
import homepageData from '@/data/homepage.json';
import testimonialsData from '@/data/testimonials.json';
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

const WHY_FEATURES = homepageData.whyWakefit.features.map((f) => ({
  icon: f.icon.replace(/Icon$/, ''),
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

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans relative">
      {/* Global Modals */}
      <CartDrawer />
      <SearchModal />

      {/* ─── Header ─── */}
      <Header brandName="Chouhan Mattress" brandLink="/" data-testid="main-header" />

      <main id="main-content" className="flex-1">
        {/* ─── Hero Carousel (Flipper Sofa Cum Bed as first slide) ─── */}
        <Hero />

        {/* ─── Shop By Categories ─── */}
        <CategoriesSection
          data={{
            headline: 'Shop By Categories',
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

        {/* ─── Testimonials ─── */}
        <TestimonialsSection
          testimonials={testimonialsData.testimonials}
          summary={testimonialsData.summary}
          data-testid="testimonials-section"
        />
      </main>

      {/* ─── Floating Sleep Assistant Chat Button (Bottom Right) ─── */}
      <a
        href="/mattress-selector"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-full flex items-center justify-center shadow-2xl hover:from-amber-300 hover:to-amber-500 hover:scale-110 transition-all cursor-pointer group border-2 border-slate-950/20"
        title="Find My Mattress Assistant"
        aria-label="Launch Interactive Sleep Assistant Quiz"
      >
        <MessageSquarePlusIcon className="w-6 h-6 text-slate-950 group-hover:rotate-12 transition-transform" />
      </a>

      {/* ─── Footer ─── */}
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

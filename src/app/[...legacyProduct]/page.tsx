/**
 * Chouhan Mattress - Legacy / Category Product Catch-All Route Guard
 * Handles paths like /office-chairs/gravity-chair, /sofa-set/3-seater-sofa/dreamer, etc.
 * Maps legacy URLs to product catalog or category PLP. Renders 404 page for unknown routes.
 */

'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetailPage from '../product/[id]/page';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import Link from 'next/link';
import { FrownIcon, HomeIcon, ShoppingBagIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function CatchAllLegacyRoute() {
  const params = useParams();
  const router = useRouter();

  const slugArray = (params?.legacyProduct as string[]) || [];
  const fullSlug = slugArray.join('/').toLowerCase();
  const lastSlug = (slugArray[slugArray.length - 1] || '').toLowerCase();
  const firstSlug = (slugArray[0] || '').toLowerCase();

  // 1. Check if first or last slug is a known category
  const isCategory = useMemo(() => {
    return (categoriesData as Record<string, any>)[firstSlug] || (categoriesData as Record<string, any>)[lastSlug];
  }, [firstSlug, lastSlug]);

  // 2. Check if path matches a known product
  const matchedProduct = useMemo(() => {
    if (!lastSlug && !fullSlug) return null;
    return (
      productsData.find((p) => String(p.id) === lastSlug || String(p.id) === fullSlug) ||
      productsData.find((p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(lastSlug)) ||
      productsData.find((p) => p.subcategory && (fullSlug.includes(p.subcategory) || lastSlug.includes(p.subcategory)))
    );
  }, [lastSlug, fullSlug]);

  // Redirect if category path
  React.useEffect(() => {
    if (isCategory && !matchedProduct) {
      const categoryName = (categoriesData as Record<string, any>)[firstSlug] ? firstSlug : lastSlug;
      router.replace(`/category/${categoryName}`);
    }
  }, [isCategory, matchedProduct, firstSlug, lastSlug, router]);

  if (matchedProduct) {
    return <ProductDetailPage />;
  }

  if (isCategory) {
    return <div className="min-h-screen bg-white flex items-center justify-center text-slate-500">Redirecting to category...</div>;
  }

  // Fallback 404 Page
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 py-20 px-4 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6 border border-amber-200">
          <FrownIcon className="w-10 h-10" />
        </div>
        <span className="text-amber-600 font-extrabold uppercase text-xs tracking-widest mb-2">404 Page Not Found</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 font-heading">Looking for Something Sleepy?</h1>
        <p className="text-slate-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          The page you requested could not be found or may have moved. Browse our best-selling handcrafted mattresses below.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="px-6 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-colors flex items-center gap-2">
            <HomeIcon className="w-4 h-4" /> Return to Home
          </Link>
          <Link href="/products" className="px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors flex items-center gap-2">
            <ShoppingBagIcon className="w-4 h-4" /> View All Products
          </Link>
        </div>
      </main>

      <MobileBottomNav />
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
        legalLinks={footerData.links.policies}
        showCopyright
        copyrightText={`© ${new Date().getFullYear()} Chouhan Mattress Private Limited.`}
      />
    </div>
  );
}

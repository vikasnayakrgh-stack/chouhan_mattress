/**
 * Chouhan Mattress - Sustainability Page (/sustainability)
 * Eco-friendly materials, zero-waste manufacturing, and green initiatives
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { LeafIcon, SparklesIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              <LeafIcon className="w-4 h-4 text-emerald-400" /> Eco-Conscious Craftsmanship
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">Sustainability & Eco-Commitment</h1>
            <p className="text-slate-300 text-xs sm:text-sm">Building comfortable sleep systems while protecting our planet</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-2">Organic & OEKO-TEX Fabrics</h3>
              <p className="text-xs sm:text-sm text-slate-600">All fabric covers are made from OEKO-TEX Standard 100 certified organic cotton and bamboo viscose, ensuring zero harmful chemicals, pesticides, or heavy metals.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-2">Zero-Waste Foam Processing</h3>
              <p className="text-xs sm:text-sm text-slate-600">Off-cut foam from manufacturing is recycled into high-density re-bonded foam for seating cushions, achieving near zero industrial landfill waste.</p>
            </div>
          </div>
        </section>
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

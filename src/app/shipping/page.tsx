/**
 * Chouhan Mattress - Shipping Info Page (/shipping)
 * Delivery SLAs, free doorstep delivery, tracking, and white-glove installation info
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { TruckIcon, ShieldCheckIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <TruckIcon className="w-4 h-4 text-amber-400" /> Pan-India Express Shipping
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">Free Doorstep Shipping & Assembly</h1>
            <p className="text-slate-300 text-xs sm:text-sm">We deliver free of cost across 19,000+ pincodes in India</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <ClockIcon className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base mb-1">Standard Delivery</h3>
                <p className="text-xs text-slate-600">3 to 7 Business Days across all metro and Tier-1/2 cities.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <TruckIcon className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base mb-1">Custom Orders</h3>
                <p className="text-xs text-slate-600">5 to 9 Business Days for handcrafted custom sizes.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <ShieldCheckIcon className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base mb-1">White-Glove Service</h3>
                <p className="text-xs text-slate-600">Free unboxing and bed assembly for all solid wood beds.</p>
              </div>
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

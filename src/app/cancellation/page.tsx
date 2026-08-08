/**
 * Chouhan Mattress - Order Cancellation Policy Page (/cancellation)
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { XCircleIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function CancellationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <XCircleIcon className="w-4 h-4 text-amber-400" /> Order Modification
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">Order Cancellation Policy</h1>
            <p className="text-slate-300 text-xs sm:text-sm">Cancel or modify your order prior to dispatch with instant refund processing</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl space-y-6 text-slate-700 text-sm">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-2">1. Cancellation Window</h3>
              <p className="text-xs sm:text-sm text-slate-600">You can cancel any un-shipped order directly from your Account Dashboard or by emailing support@chouhanmattress.com within 24 hours of placing the order.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-base mb-2">2. Refund Processing</h3>
              <p className="text-xs sm:text-sm text-slate-600">Prepaid orders canceled prior to dispatch are refunded 100% back to your original payment method within 3 to 5 business days.</p>
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

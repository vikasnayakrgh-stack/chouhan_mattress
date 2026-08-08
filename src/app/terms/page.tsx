/**
 * Chouhan Mattress - Terms of Service Page (/terms)
 * Store conditions, purchase agreements, warranty legal terms, and store usage policies
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { FileTextIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <FileTextIcon className="w-4 h-4 text-amber-400" /> Store Terms
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">Terms of Service & Conditions</h1>
            <p className="text-slate-300 text-xs sm:text-sm">Effective as of January 2026 • Chouhan Mattress Private Limited</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl space-y-8 text-slate-700 text-sm leading-relaxed">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base mb-2">1. Agreement to Terms</h2>
              <p>By accessing or making a purchase on the Chouhan Mattress website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access our store services.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base mb-2">2. Pricing & Product Accuracy</h2>
              <p>All prices are listed in Indian Rupees (INR) inclusive of applicable taxes. We reserve the right to correct pricing errors or modify product specifications without prior notice.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base mb-2">3. 100-Night Trial & Returns</h2>
              <p>The 100-night trial applies to eligible mattress models purchased directly from our official website. Returned mattresses must be free of major physical damage or chemical stains.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base mb-2">4. Warranty Limitations</h2>
              <p>Warranty coverage applies to structural and material defects under standard residential usage. Commercial, industrial, or rental usage is excluded unless explicitly agreed in writing.</p>
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

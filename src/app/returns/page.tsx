/**
 * Chouhan Mattress - Returns & 100-Night Trial Page (/returns)
 * 100-Night trial terms, pickup process, and refund policy
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { RotateCcwIcon, ShieldCheckIcon, CheckCircle2Icon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <RotateCcwIcon className="w-4 h-4 text-amber-400" /> 100-Night Risk-Free Trial
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">100-Night Trial & Returns Policy</h1>
            <p className="text-slate-300 text-xs sm:text-sm">Test your mattress in the comfort of your home with total peace of mind</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3 font-black text-lg">1</div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Sleep for 30+ Nights</h3>
                <p className="text-xs text-slate-600">Your body needs 2-3 weeks to adjust to a new orthopedic mattress support system.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3 font-black text-lg">2</div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Request Easy Return</h3>
                <p className="text-xs text-slate-600">Contact support@chouhanmattress.com within 100 nights if you are unsatisfied.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3 font-black text-lg">3</div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Free Pickup & 100% Refund</h3>
                <p className="text-xs text-slate-600">We pick up the mattress for free and process a full refund to your original payment method.</p>
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

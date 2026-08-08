/**
 * Chouhan Mattress - Sleep Journal & Blog Page (/blog)
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { BookOpenIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpenIcon className="w-4 h-4 text-amber-400" /> Sleep Journal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">The Chouhan Sleep Journal</h1>
            <p className="text-slate-300 text-xs sm:text-sm">Expert articles on sleep science, orthopedic support, and bedroom wellness</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl grid sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Sleep Science</span>
              <h3 className="font-bold text-slate-900 text-base mt-1 mb-2">How Spinal Alignment Affects Deep Sleep Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Discover why proper spinal support reduces toss-and-turn frequency by up to 60%.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Mattress Care</span>
              <h3 className="font-bold text-slate-900 text-base mt-1 mb-2">5 Simple Habits to Extend Mattress Lifespan to 10+ Years</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Learn proper rotation techniques, protective encasement usage, and cleaning tips.</p>
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

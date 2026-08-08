/**
 * Chouhan Mattress - Mattress & Bed Size Dimensions Guide (/size-guide)
 * Standard Single, Double, Queen, King size dimensions and custom size ordering info
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { RulerIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

const SIZES = [
  { name: 'Single Mattress', inches: '36" x 75" / 36" x 78"', cm: '91 x 190 cm', occupants: '1 Adult', bestFor: 'Kids rooms, single beds, guest rooms' },
  { name: 'Double Mattress', inches: '48" x 75" / 48" x 78"', cm: '122 x 190 cm', occupants: '1 Adult + Child', bestFor: 'Compact bedrooms, single adults wanting extra room' },
  { name: 'Queen Mattress', inches: '60" x 75" / 60" x 78"', cm: '152 x 198 cm', occupants: '2 Adults', bestFor: 'Standard master bedrooms, couples' },
  { name: 'King Mattress', inches: '72" x 75" / 72" x 78"', cm: '182 x 198 cm', occupants: '2 Adults + Child', bestFor: 'Spacious master bedrooms, maximum sleep freedom' },
];

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <RulerIcon className="w-4 h-4 text-amber-400" /> Dimension Chart
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">Mattress & Bed Size Guide</h1>
            <p className="text-slate-300 text-xs sm:text-sm">Find the perfect mattress dimensions for your bed frame</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Size Name</th>
                    <th className="p-4">Dimensions (Inches)</th>
                    <th className="p-4">Dimensions (CM)</th>
                    <th className="p-4">Recommended For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SIZES.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{s.name}</td>
                      <td className="p-4 text-amber-600 font-semibold">{s.inches}</td>
                      <td className="p-4 text-slate-600">{s.cm}</td>
                      <td className="p-4 text-slate-600">{s.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

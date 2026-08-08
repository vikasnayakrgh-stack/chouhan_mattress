/**
 * Chouhan Mattress - Interactive Mattress & Bed Size Guide (/size-guide)
 * Interactive visual bed simulator with occupant silhouettes and dimension callouts
 */

'use client';

import React, { useState } from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { RulerIcon, UsersIcon, SparklesIcon, CheckCircle2Icon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

interface SizeDetails {
  id: string;
  name: string;
  inches: string;
  cm: string;
  occupants: string;
  occupantCount: number;
  widthRatio: number; // percentage width relative to king size
  bestFor: string;
  desc: string;
}

const SIZES: SizeDetails[] = [
  { id: 'single', name: 'Single Mattress', inches: '36" x 75" / 78"', cm: '91 x 198 cm', occupants: '1 Adult', occupantCount: 1, widthRatio: 50, bestFor: 'Kids rooms, single beds, guest rooms', desc: 'Compact single sleeper dimensions providing optimal space efficiency.' },
  { id: 'double', name: 'Double Mattress', inches: '48" x 75" / 78"', cm: '122 x 198 cm', occupants: '1 Adult + Child', occupantCount: 2, widthRatio: 66, bestFor: 'Compact master bedrooms, single adults wanting extra room', desc: 'Spacious for single sleepers who move around during sleep.' },
  { id: 'queen', name: 'Queen Mattress', inches: '60" x 75" / 78"', cm: '152 x 198 cm', occupants: '2 Adults', occupantCount: 2, widthRatio: 83, bestFor: 'Standard master bedrooms, couples', desc: 'India’s most popular mattress size for couples.' },
  { id: 'king', name: 'King Mattress', inches: '72" x 75" / 78"', cm: '182 x 198 cm', occupants: '2 Adults + Child', occupantCount: 3, widthRatio: 100, bestFor: 'Spacious master bedrooms, maximum sleep freedom', desc: 'Maximum luxury and freedom with zero partner disturbance.' },
];

export default function SizeGuidePage() {
  const [selectedSizeId, setSelectedSizeId] = useState<string>('queen');
  const currentSize = SIZES.find((s) => s.id === selectedSizeId) || SIZES[2];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        {/* Banner */}
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <RulerIcon className="w-4 h-4 text-amber-400" /> Touch-Friendly Simulator
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">Interactive Mattress Size Guide</h1>
            <p className="text-slate-300 text-xs sm:text-sm">Select a size below to visualize bed dimensions & room proportions</p>
          </div>
        </section>

        {/* Interactive Simulator Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Mobile Tab Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
              {SIZES.map((s) => {
                const isActive = s.id === selectedSizeId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSizeId(s.id)}
                    className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-center transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-500/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s.name.replace(' Mattress', '')}
                  </button>
                );
              })}
            </div>

            {/* Visual Bed Display Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl mb-10 flex flex-col items-center">
              <span className="text-xs font-extrabold uppercase text-amber-400 tracking-widest mb-1">{currentSize.name} Diagram</span>
              <div className="text-xl sm:text-2xl font-black text-white mb-6">{currentSize.inches}</div>

              {/* Bed Illustration Box */}
              <div className="w-full max-w-md h-64 bg-slate-800 rounded-2xl border-4 border-amber-500/40 relative flex items-center justify-center overflow-hidden transition-all duration-300 p-4">
                {/* Scaled Mattress Frame */}
                <div
                  className="bg-slate-900 rounded-xl border-2 border-amber-400/70 h-full flex items-center justify-evenly transition-all duration-300 shadow-inner px-2"
                  style={{ width: `${currentSize.widthRatio}%` }}
                >
                  {/* Occupant Silhouettes */}
                  {Array.from({ length: currentSize.occupantCount }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center opacity-90 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-amber-400/80 mb-1 flex items-center justify-center text-slate-950 font-black text-[10px]">
                        🧑
                      </div>
                      <div className="w-6 h-24 bg-amber-400/50 rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Dimension Callouts Overlay */}
                <div className="absolute top-2 left-2 text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  W: {currentSize.inches.split('x')[0]}
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  L: {currentSize.inches.split('x')[1]}
                </div>
              </div>

              {/* Size Metadata */}
              <div className="grid sm:grid-cols-3 gap-4 w-full mt-8 text-center text-xs">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Metric Dimensions</div>
                  <div className="text-amber-300 font-bold mt-0.5">{currentSize.cm}</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Occupants</div>
                  <div className="text-amber-300 font-bold mt-0.5">{currentSize.occupants}</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Best Suited For</div>
                  <div className="text-amber-300 font-bold mt-0.5 truncate">{currentSize.bestFor}</div>
                </div>
              </div>
            </div>

            {/* Standard Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm mb-8">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Size</th>
                    <th className="p-4">Dimensions (Inches)</th>
                    <th className="p-4">Dimensions (CM)</th>
                    <th className="p-4">Ideal For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SIZES.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedSizeId(s.id)}
                      className={`cursor-pointer transition-colors ${s.id === selectedSizeId ? 'bg-amber-50/80 font-bold' : 'hover:bg-slate-50'}`}
                    >
                      <td className="p-4 text-slate-900">{s.name}</td>
                      <td className="p-4 text-amber-600 font-semibold">{s.inches}</td>
                      <td className="p-4 text-slate-600">{s.cm}</td>
                      <td className="p-4 text-slate-600">{s.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Shop CTA */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white">Need a Custom Size Mattress?</h3>
                <p className="text-xs text-slate-300 mt-1">We handcraft custom mattresses tailored to your exact bed frame in 5 days.</p>
              </div>
              <Link
                href="/category/mattresses"
                className="px-6 py-3 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2 flex-shrink-0"
              >
                <span>Shop All Mattresses</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
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

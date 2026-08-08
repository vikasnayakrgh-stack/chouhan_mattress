/**
 * Chouhan Mattress - About Us Page (/about)
 * Company heritage, handcrafted sleep engineering, zero motion transfer technology, and brand mission
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { AwardIcon, ShieldCheckIcon, SparklesIcon, HeartIcon, UsersIcon, FactoryIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-4xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <SparklesIcon className="w-4 h-4 text-amber-400" /> Crafting Royal Sleep Since 2012
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 font-heading leading-tight">
              Reinventing How India Sleeps, <br className="hidden sm:inline" /> One Handcrafted Mattress at a Time
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              At Chouhan Mattress, we combine orthopedic sleep science, zero-motion transfer technology, and premium Sheesham craftsmanship to deliver pristine sleep comfort straight to your home.
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 bg-amber-500/5 border-b border-amber-500/10">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl sm:text-4xl font-black text-amber-600 font-heading">500,000+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Happy Sleepers</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl sm:text-4xl font-black text-amber-600 font-heading">100-Nights</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Risk-Free Home Trial</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl sm:text-4xl font-black text-amber-600 font-heading">10 Years</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Full Warranty Protection</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl sm:text-4xl font-black text-amber-600 font-heading">100%</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">Handcrafted in India</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">Our Four Pillars of Sleep Excellence</h2>
              <p className="text-slate-600 text-sm mt-2">Why thousands trust Chouhan Mattress for their bedrooms</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Orthopedic Spine Alignment</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Designed in collaboration with ergonomic spinal experts to provide targeted lumbar support, relieving pressure points and back strain.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <FactoryIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Direct-from-Factory Value</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    By eliminating middlemen, distributors, and high retail markups, we deliver luxury-grade sleep products at fair, honest prices.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <AwardIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Zero Motion Transfer</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    High-resilience memory foam and pocketed spring cores absorb partner movement so you sleep undisturbed all night.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <HeartIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">Eco-Friendly & Non-Toxic</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    OEKO-TEX certified fabrics, VOC-free organic latex, and sustainably sourced Sheesham wood built for healthy living environments.
                  </p>
                </div>
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

/**
 * Chouhan Mattress - Nodal Grievance Officer Details Page (/grievance)
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { ScaleIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function GrievancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <ScaleIcon className="w-4 h-4 text-amber-400" /> Statutory Compliance
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">Nodal Grievance Officer</h1>
            <p className="text-slate-300 text-xs sm:text-sm">In compliance with Consumer Protection (E-Commerce) Rules, 2020</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-2xl bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-slate-800 text-sm">
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-200 pb-3">Grievance Redressal Contact</h3>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-bold text-slate-500">Name:</span>
              <span className="col-span-2 font-bold text-slate-900">Vikram Chouhan</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-bold text-slate-500">Designation:</span>
              <span className="col-span-2 text-slate-700">Nodal Grievance Officer</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-bold text-slate-500">Company:</span>
              <span className="col-span-2 text-slate-700">{footerData.company.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-bold text-slate-500">Email:</span>
              <span className="col-span-2 text-amber-600 font-bold">grievance@chouhanmattress.com</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-bold text-slate-500">Phone:</span>
              <span className="col-span-2 text-slate-700">+91 9876543210 (Ext 4)</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1">
              <span className="font-bold text-slate-500">Address:</span>
              <span className="col-span-2 text-slate-700 leading-relaxed">{footerData.company.address}</span>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-800 leading-relaxed mt-4">
              <strong>SLA:</strong> All grievances are acknowledged within 48 hours and resolved within 1 business day under standard guidelines.
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

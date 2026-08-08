/**
 * Chouhan Mattress - Privacy Policy Page (/privacy)
 * Data protection, security, encryption, and customer data rights disclosures
 */

'use client';

import React from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { ShieldCheckIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        <section className="bg-[#0F172A] text-white py-14 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheckIcon className="w-4 h-4 text-amber-400" /> Data Security Guarantee
            </span>
            <h1 className="text-3xl sm:text-4xl font-black mb-2 font-heading">Privacy Policy & Data Security</h1>
            <p className="text-slate-300 text-xs sm:text-sm">Last Updated: January 2026 • Effective for all Chouhan Mattress Customers</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl space-y-8 text-slate-700 text-sm leading-relaxed">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base mb-2">1. Information We Collect</h2>
              <p>When you place an order or create an account with Chouhan Mattress Private Limited, we collect your name, delivery address, phone number, email address, and order transaction history. Payment card details are processed directly via PCI-DSS compliant gateways and are never stored on our servers.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base mb-2">2. How We Use Your Data</h2>
              <p>Your information is used strictly to fulfill order delivery, send shipment tracking notifications, process warranty registrations, and handle 100-night trial return requests. We do not sell or rent customer data to third-party advertisers.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base mb-2">3. Data Security & Encryption</h2>
              <p>All data transmitted between your browser and our platform is encrypted using 256-bit SSL encryption. Customer database records in Supabase PostgreSQL are protected via Row Level Security (RLS) policies.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h2 className="font-bold text-slate-900 text-base mb-2">4. Your Data Protection Rights</h2>
              <p>You have the right to request access to your personal data, request corrections, or request deletion of your account records by contacting our Data Grievance Officer at privacy@chouhanmattress.com.</p>
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

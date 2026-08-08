/**
 * Chouhan Mattress - Frequently Asked Questions (FAQs) Page (/faqs)
 * Searchable & expandable accordion categories (Ordering, Delivery, 100-Night Trial, Warranty, Returns)
 */

'use client';

import React, { useState } from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { HelpCircleIcon, SearchIcon, ChevronDownIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

const FAQ_LIST = [
  {
    category: '100-Night Trial & Returns',
    question: 'How does the 100-Night Free Trial work?',
    answer: 'You can test any eligible Chouhan Mattress in the comfort of your home for 100 nights starting from the delivery date. If you are not completely satisfied within 100 nights, contact us to initiate a free pickup and 100% full refund.',
  },
  {
    category: '100-Night Trial & Returns',
    question: 'How do I request a trial return?',
    answer: 'Simply email support@chouhanmattress.com or log into your account dashboard. We will arrange a free reverse pickup. Mattress must be clean and free of physical damage or stains.',
  },
  {
    category: 'Warranty & Maintenance',
    question: 'What is covered under the 10-Year Warranty?',
    answer: 'Our 10-year warranty covers manufacturing defects, sagging greater than 1 inch, foam degradation, and structural coil defects. Normal softening or cosmetic wear is excluded.',
  },
  {
    category: 'Ordering & Custom Sizes',
    question: 'Can I order a custom size mattress?',
    answer: 'Yes! We specialize in handcrafted custom mattress sizes. Use our online Custom Size Calculator or contact our team to specify exact length, width, and thickness in inches.',
  },
  {
    category: 'Shipping & Delivery',
    question: 'How long does delivery take and is it free?',
    answer: 'Delivery is 100% free across India. Standard orders are delivered in 3 to 7 business days depending on your pincode. Custom mattresses take 5 to 9 business days.',
  },
  {
    category: 'Care & Maintenance',
    question: 'Do I need to rotate or flip my mattress?',
    answer: 'Our single-sided orthopedic mattresses do not need to be flipped. We recommend rotating the mattress 180 degrees every 3 to 6 months for even wear.',
  },
];

export default function FAQsPage() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_LIST.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        {/* Banner */}
        <section className="bg-[#0F172A] text-white py-16 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircleIcon className="w-4 h-4 text-amber-400" /> Instant Help Center
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 font-heading">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Find answers to questions about 100-night trial, warranty coverage, custom mattress sizes, shipping timelines, and payments.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto">
              <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions (e.g. warranty, 100-night trial, custom size)..."
                className="w-full h-12 rounded-2xl pl-12 pr-4 bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* FAQs Accordion List */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full p-5 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-amber-600 tracking-wider block mb-1">
                            {faq.category}
                          </span>
                          <span>{faq.question}</span>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-500' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="p-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-slate-600 text-sm">No matching questions found for "{search}".</p>
                <button onClick={() => setSearch('')} className="mt-4 text-amber-600 font-bold text-xs underline">Clear Search Filter</button>
              </div>
            )}
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

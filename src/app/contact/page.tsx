/**
 * Chouhan Mattress - Contact Us Page (/contact)
 * Showroom addresses, support lines, business hours, and interactive inquiry form
 */

'use client';

import React, { useState } from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon, MessageSquareIcon, CheckCircle2Icon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <CartDrawer />
      <SearchModal />
      <Header brandName="Chouhan Mattress" brandLink="/" />

      <main id="main-content" className="flex-1 pb-20">
        {/* Header Banner */}
        <section className="bg-[#0F172A] text-white py-16 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <MessageSquareIcon className="w-4 h-4 text-amber-400" /> We are here to help
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 font-heading">
              Contact Chouhan Mattress Customer Support
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Have a question about mattress dimensions, custom sizes, 100-night trial returns, or delivery timelines? Our team is available 7 days a week.
            </p>
          </div>
        </section>

        {/* Contact Info Cards + Form */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info Sidebar */}
              <div className="space-y-6 lg:col-span-1">
                <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="font-bold text-lg text-amber-400">Direct Support Hotline</h3>
                  
                  <div className="flex items-start gap-3 text-sm">
                    <PhoneIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{footerData.company.phone}</div>
                      <div className="text-xs text-slate-400">Toll-Free Customer Care</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <MailIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{footerData.company.email}</div>
                      <div className="text-xs text-slate-400">24/7 Email Inquiries</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <ClockIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{footerData.company.hours}</div>
                      <div className="text-xs text-slate-400">Support Working Hours</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm border-t border-slate-800 pt-4">
                    <MapPinIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">{footerData.company.name}</div>
                      <div className="text-xs text-slate-400 leading-relaxed mt-0.5">{footerData.company.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Form */}
              <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-xl mb-2">Send Us a Direct Message</h3>
                <p className="text-xs text-slate-500 mb-6">Fill out the form below and a Sleep Consultant will respond within 2 hours.</p>

                {submitted ? (
                  <div className="py-12 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                    <CheckCircle2Icon className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-900 text-lg">Message Sent Successfully!</h4>
                    <p className="text-xs text-slate-600 mt-2">Thank you for contacting Chouhan Mattress. Our team is working on your request.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                        <input required type="text" placeholder="Rahul Sharma" className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                        <input required type="tel" placeholder="+91 9876543210" className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                        <input required type="email" placeholder="rahul@example.com" className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Inquiry Type *</label>
                        <select required className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500 bg-white">
                          <option value="custom-size">Custom Size Mattress Inquiry</option>
                          <option value="order-status">Order Track & Delivery Status</option>
                          <option value="trial-return">100-Night Trial & Returns</option>
                          <option value="warranty">10-Year Warranty Claim</option>
                          <option value="bulk-order">Bulk Commercial / Hotel Order</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                      <textarea required rows={4} placeholder="Tell us how we can help you..." className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                    </div>

                    <button type="submit" className="w-full h-11 bg-amber-500 text-slate-950 font-bold text-sm rounded-xl hover:bg-amber-400 transition-colors shadow-sm">
                      Submit Inquiry
                    </button>
                  </form>
                )}
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

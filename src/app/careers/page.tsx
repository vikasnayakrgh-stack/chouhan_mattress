/**
 * Chouhan Mattress - Careers Page (/careers)
 * Work culture, open positions, employee benefits, and job application submission
 */

'use client';

import React, { useState } from 'react';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { MobileBottomNav } from '@/components/library/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { BriefcaseIcon, SparklesIcon, HeartIcon, UsersIcon, CheckCircle2Icon, ArrowRightIcon } from 'lucide-react';
import footerData from '@/data/footer.json';

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

const OPEN_POSITIONS = [
  { title: 'Senior Ergonomic Design Specialist', department: 'R&D / Product Design', location: 'New Delhi (On-site)', type: 'Full-time' },
  { title: 'Full Stack Next.js / Supabase Engineer', department: 'Engineering & Tech', location: 'Remote / Hybrid', type: 'Full-time' },
  { title: 'E-commerce Conversion Specialist', department: 'Growth Marketing', location: 'New Delhi (Hybrid)', type: 'Full-time' },
  { title: 'Quality Assurance & Material Engineer', department: 'Manufacturing', location: 'New Delhi (On-site)', type: 'Full-time' },
  { title: 'Customer Delight & Sleep Experience Lead', department: 'Customer Support', location: 'Remote', type: 'Full-time' },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
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
        {/* Hero */}
        <section className="bg-[#0F172A] text-white py-16 px-4 text-center border-b border-amber-500/20">
          <div className="container mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <BriefcaseIcon className="w-4 h-4 text-amber-400" /> Join Our Mission
            </span>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 font-heading">
              Build the Future of Sleep Tech & Craftsmanship
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We are a team of sleep scientists, designers, engineers, and craftspeople dedicated to giving millions of households a rejuvenating night's rest.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Competitive Pay & Equity</h3>
                <p className="text-xs text-slate-600">Top market compensation, health insurance, and performance bonuses.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <HeartIcon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Free Mattress Allowance</h3>
                <p className="text-xs text-slate-600">Every team member receives a complimentary flagship Chouhan Mattress sleep setup.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Hybrid & Flexible Work</h3>
                <p className="text-xs text-slate-600">Autonomy, flexible hours, and remote-friendly team collaboration policies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions List */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">Current Openings</h2>
              <p className="text-slate-600 text-sm mt-1">Explore our active job openings across tech, design, and operations</p>
            </div>

            <div className="space-y-4">
              {OPEN_POSITIONS.map((job, idx) => (
                <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/50 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>📁 {job.department}</span>
                      <span>📍 {job.location}</span>
                      <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">{job.type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setSelectedJob(job.title); setSubmitted(false); }}
                    className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-lg">✕</button>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2Icon className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-900 text-lg">Application Submitted!</h3>
                  <p className="text-xs text-slate-600 mt-2">Thank you for applying for <strong>{selectedJob}</strong>. Our HR team will reach out within 2 business days.</p>
                  <button onClick={() => setSelectedJob(null)} className="mt-6 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl">Close Window</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg">Apply for {selectedJob}</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input required type="text" placeholder="Rahul Sharma" className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input required type="email" placeholder="rahul@example.com" className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                    <input required type="tel" placeholder="+91 9876543210" className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn / Portfolio URL</label>
                    <input type="url" placeholder="https://linkedin.com/in/..." className="w-full h-11 px-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <button type="submit" className="w-full h-11 bg-amber-500 text-slate-950 font-bold text-sm rounded-xl hover:bg-amber-400 transition-colors">Submit Application</button>
                </form>
              )}
            </div>
          </div>
        )}
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

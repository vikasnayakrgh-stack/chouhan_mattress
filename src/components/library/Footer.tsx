/**
 * Wakefit Clone - Footer Component
 * Reusable, accessible footer with navigation, social links, newsletter, and contact info
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { cn } from '@/lib/utils';
import { FooterProps, FooterNavSection, FooterSocialLink, NewsletterConfig, ContactInfo, BaseComponentProps } from '@/types';

export function Footer({
  className = '',
  brandName,
  brandDescription,
  logo,
  navSections = [],
  socialLinks = [],
  newsletter,
  contactInfo,
  paymentMethods,
  certifications,
  showCopyright = true,
  copyrightText,
  legalLinks = [],
  'data-testid': testId,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'bg-[#090D16] text-white border-t border-slate-800',
        className
      )}
      role="contentinfo"
      data-testid={testId}
    >
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-800 bg-[#0F172A] py-8">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-2xl mb-1 block">🛡️</span>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">100-Night Trial</h4>
            <p className="text-[11px] text-slate-400 mt-1">100% Risk-free sleep guarantee at home</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-2xl mb-1 block">📜</span>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">10-Year Warranty</h4>
            <p className="text-[11px] text-slate-400 mt-1">Direct sagging replacement coverage</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-2xl mb-1 block">🚚</span>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">White-Glove Delivery</h4>
            <p className="text-[11px] text-slate-400 mt-1">Free unboxing & setup in 150+ cities</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-2xl mb-1 block">💳</span>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Zero-Cost EMI</h4>
            <p className="text-[11px] text-slate-400 mt-1">Instant bank EMI starting ₹1,249/mo</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="block mb-4" aria-label={`${brandName} - Home`}>
              {logo || (
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-heading">
                    CHOUHAN
                  </span>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em]">
                    MATTRESS
                  </span>
                </div>
              )}
            </Link>
            {brandDescription ? (
              <p className="text-slate-400 mb-6 max-w-xs text-xs leading-relaxed">
                {brandDescription}
              </p>
            ) : (
              <p className="text-slate-400 mb-6 max-w-xs text-xs leading-relaxed">
                Engineered sleep systems handcrafted for royal comfort. Designed with spine-alignment memory foam, zero-motion pocket springs, and 100% natural organic latex.
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3" role="list" aria-label="Social media links">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label || link.platform}
                    className={cn(
                      'flex items-center justify-center w-9 h-9 rounded-xl',
                      'bg-slate-900 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300',
                      'text-slate-400 border border-slate-800'
                    )}
                    role="listitem"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            )}

            {/* Newsletter */}
            {newsletter && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get('email') as string;
                  if (email && newsletter.onSubmit) {
                    newsletter.onSubmit(email);
                  }
                  e.currentTarget.reset();
                }}
                className="mt-6 max-w-xs"
                role="search"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <div className="flex gap-2">
                  <input
                    id="footer-email"
                    type="email"
                    name="email"
                    placeholder={newsletter.placeholder || 'Enter email for VIP offers'}
                    required
                    className={cn(
                      'flex-1 px-3.5 py-2.5 rounded-xl text-xs',
                      'bg-slate-900 border border-slate-800',
                      'text-white placeholder:text-slate-500',
                      'focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500',
                      'transition-all duration-200'
                    )}
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    className={cn(
                      'px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950',
                      'bg-amber-500 hover:bg-amber-400',
                      'transition-all duration-200 shadow-md'
                    )}
                    aria-label={newsletter.buttonText || 'Subscribe'}
                  >
                    {newsletter.buttonText || 'Join'}
                  </button>
                </div>
              </motion.form>
            )}
          </motion.div>

          {/* Navigation Columns */}
          {navSections.map((section, sectionIndex) => (
            <motion.nav
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (sectionIndex + 1), duration: 0.4 }}
              aria-label={section.title}
            >
              <h3 className="font-bold text-sm text-amber-400 mb-4 uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-2.5" role="list">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-slate-400 hover:text-amber-400 transition-colors duration-200 text-xs font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          {/* Contact Info Column */}
          {contactInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="lg:col-span-2"
            >
              <h3 className="font-bold text-sm text-amber-400 mb-4 uppercase tracking-wider">Sleep Concierge</h3>
              <address className="not-italic space-y-3 text-slate-400 text-xs">
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                  >
                    <svg className="h-4 w-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {contactInfo.email}
                  </a>
                )}
                {contactInfo.phone && (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                  >
                    <svg className="h-4 w-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {contactInfo.phone}
                  </a>
                )}
                {contactInfo.address && (
                  <div className="flex gap-2">
                    <svg className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{contactInfo.address}</span>
                  </div>
                )}
              </address>
            </motion.div>
          )}
        </div>
      </div>

      {/* Copyright & Legal Links */}
      <div className="border-t border-slate-800 bg-[#070B19]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            {showCopyright && (
              <p className="text-slate-400 text-xs text-center md:text-left">
                {copyrightText || `© ${currentYear} Chouhan Mattress. Engineered For Royal Sleep. All rights reserved.`}
              </p>
            )}

            {/* Legal Links */}
            {legalLinks.length > 0 && (
              <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                {legalLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors text-xs"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
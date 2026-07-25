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
        'bg-wakefit-dark text-white',
        className
      )}
      role="contentinfo"
      data-testid={testId}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="block mb-6" aria-label={`${brandName} - Home`}>
              {logo || (
                <span className="text-2xl md:text-3xl font-bold text-wakefit-orange">
                  {brandName}
                </span>
              )}
            </Link>
            {brandDescription && (
              <p className="text-wakefit-gray/70 mb-6 max-w-xs leading-relaxed">
                {brandDescription}
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4" role="list" aria-label="Social media links">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label || link.platform}
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-full',
                      'bg-white/10 hover:bg-wakefit-orange transition-all duration-300',
                      'text-wakefit-gray/70 hover:text-white'
                    )}
                    role="listitem"
                    whileHover={{ scale: 1.1 }}
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
                className="mt-8 max-w-xs"
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
                    placeholder={newsletter.placeholder || 'Enter your email'}
                    required
                    className={cn(
                      'flex-1 px-4 py-3 rounded-lg',
                      'bg-white/5 border border-white/10',
                      'text-white placeholder:text-wakefit-gray/50',
                      'focus:outline-none focus:ring-2 focus:ring-wakefit-orange/50 focus:border-transparent',
                      'transition-all duration-200'
                    )}
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    className={cn(
                      'px-4 py-3 rounded-lg font-semibold text-white',
                      'bg-wakefit-orange hover:bg-wakefit-orange/90',
                      'transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-wakefit-orange/50 focus:ring-offset-2 focus:ring-offset-wakefit-dark'
                    )}
                    aria-label={newsletter.buttonText || 'Subscribe'}
                  >
                    {newsletter.buttonText || 'Subscribe'}
                  </button>
                </div>
                {newsletter.disclaimer && (
                  <p className="text-xs text-wakefit-gray/50 mt-2 text-center">
                    {newsletter.disclaimer}
                  </p>
                )}
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
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-3" role="list">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-wakefit-gray/70 hover:text-wakefit-orange transition-colors duration-200 text-sm"
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
              <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
              <address className="not-italic space-y-3 text-wakefit-gray/70 text-sm">
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="flex items-center gap-2 hover:text-wakefit-orange transition-colors"
                  >
                    <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {contactInfo.email}
                  </a>
                )}
                {contactInfo.phone && (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="flex items-center gap-2 hover:text-wakefit-orange transition-colors"
                  >
                    <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {contactInfo.phone}
                  </a>
                )}
                {contactInfo.address && (
                  <div className="flex gap-2">
                    <svg className="h-5 w-5 flex-shrink-0 mt-0.5 text-wakefit-gray/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{contactInfo.address}</span>
                  </div>
                )}
                {contactInfo.hours && (
                  <div className="flex gap-2">
                    <svg className="h-5 w-5 flex-shrink-0 mt-0.5 text-wakefit-gray/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{contactInfo.hours}</span>
                  </div>
                )}
              </address>
            </motion.div>
          )}
        </div>

        {/* Payment Methods & Certifications */}
        {(paymentMethods && paymentMethods.length > 0) || (certifications && certifications.length > 0) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap">
              {paymentMethods && paymentMethods.length > 0 && (
                <div className="flex items-center gap-4 flex-wrap" role="list" aria-label="Accepted payment methods">
                  <span className="text-wakefit-gray/70 text-sm font-medium">Payments:</span>
                  <div className="flex items-center gap-3" role="list">
                    {paymentMethods.map((method, index) => (
                      <span key={index} role="listitem" className="h-6" aria-label={method.name}>
                        {method.icon}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {certifications && certifications.length > 0 && (
                <div className="flex items-center gap-4 flex-wrap" role="list" aria-label="Certifications">
                  <span className="text-wakefit-gray/70 text-sm font-medium">Certifications:</span>
                  <div className="flex items-center gap-3" role="list">
                    {certifications.map((cert, index) => (
                      <span key={index} role="listitem" className="h-6" aria-label={cert.name || 'Certification'}>
                        {cert.icon}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : null}
      </div>

      {/* Copyright & Legal Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="border-t border-white/10"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            {showCopyright && (
              <p className="text-wakefit-gray/60 text-sm text-center md:text-left">
                {copyrightText || `© ${currentYear} ${brandName}. All rights reserved.`}
              </p>
            )}

            {/* Legal Links */}
            {legalLinks.length > 0 && (
              <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                {legalLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-wakefit-gray/60 hover:text-wakefit-orange transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

export default Footer;
'use client'

import Link from 'next/link'
import { Facebook, Instagram, Youtube, Twitter, Linkedin, Truck, Shield, RotateCcw, Headphones, Award, MapPin, Phone, Mail } from 'lucide-react'

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
    { label: 'Investors', href: '/investors' },
    { label: 'Sustainability', href: '/sustainability' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Warranty', href: '/warranty' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  shop: [
    { label: 'Mattresses', href: '/mattresses' },
    { label: 'Beds', href: '/beds' },
    { label: 'Sofas', href: '/sofas' },
    { label: 'Furniture', href: '/furniture' },
    { label: 'Pillows & Bedding', href: '/bedding' },
    { label: 'Home Decor', href: '/decor' },
  ],
  policies: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Cancellation Policy', href: '/cancellation' },
    { label: 'Grievance Officer', href: '/grievance' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/wakefit', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/wakefit', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/wakefit', label: 'YouTube' },
  { icon: Twitter, href: 'https://twitter.com/wakefit', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/wakefit', label: 'LinkedIn' },
]

const trustBadges = [
  { icon: Shield, title: '7+ Years Warranty', desc: 'On selected products' },
  { icon: Truck, title: 'Free Shipping', desc: 'Pan India delivery' },
  { icon: RotateCcw, title: '100 Night Trial', desc: 'Risk-free returns' },
  { icon: Headphones, title: 'Easy Returns', desc: 'Hassle-free process' },
  { icon: Award, title: 'Award Winning', desc: 'Forbes D2C Award' },
]

export function Footer() {
  return (
    <footer className="bg-wakefit-black text-wakefit-white" role="contentinfo">
      {/* Trust Badges */}
      <div className="border-b border-white/10">
        <div className="container-wakefit py-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-wakefit-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-6 h-6 text-wakefit-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-body-md">{badge.title}</h4>
                  <p className="text-wakefit-gray-light text-body-sm mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="py-16 border-b border-white/10">
        <div className="container-wakefit">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2" aria-label="Wakefit Home">
                <div className="w-10 h-10 bg-wakefit-orange rounded-lg flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-xl">W</span>
                </div>
                <span className="font-heading font-bold text-2xl">Wakefit</span>
              </Link>
              <p className="text-wakefit-gray-light text-body-md max-w-xs leading-relaxed">
                Better Sleep, Better Life. India's most trusted mattress & furniture brand with 25 Lakh+ happy customers.
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-wakefit-orange hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-6 text-body-sm text-wakefit-gray-light">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  173+ Stores Across India
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  1800-123-4567
                </span>
              </div>
            </div>

            {/* Company */}
            <nav aria-label="Company links">
              <h4 className="font-semibold text-body-md mb-4">Company</h4>
              <ul className="space-y-3" role="list">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-wakefit-gray-light hover:text-wakefit-orange transition-colors text-body-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Help */}
            <nav aria-label="Help links">
              <h4 className="font-semibold text-body-md mb-4">Help & Support</h4>
              <ul className="space-y-3" role="list">
                {footerLinks.help.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-wakefit-gray-light hover:text-wakefit-orange transition-colors text-body-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Shop */}
            <nav aria-label="Shop categories">
              <h4 className="font-semibold text-body-md mb-4">Shop By Category</h4>
              <ul className="space-y-3" role="list">
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-wakefit-gray-light hover:text-wakefit-orange transition-colors text-body-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Policies & Payment */}
      <div className="py-10 border-b border-white/10">
        <div className="container-wakefit">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <nav aria-label="Legal policies" className="flex flex-wrap items-center gap-4 md:gap-6">
              {footerLinks.policies.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-wakefit-gray-light hover:text-wakefit-orange transition-colors text-body-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <span className="text-wakefit-gray-light text-body-sm">Secure Payments:</span>
              <div className="flex items-center gap-2">
                {['Visa', 'Mastercard', 'RuPay', 'UPI', 'NetBanking', 'EMI'].map((method) => (
                  <span key={method} className="px-3 py-1 bg-white/5 rounded text-body-sm font-medium text-white">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6">
        <div className="container-wakefit">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-wakefit-gray-light text-body-sm text-center md:text-left">
              © {new Date().getFullYear()} Wakefit Innovations Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-body-sm text-wakefit-gray-light">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                support@wakefit.co
              </span>
              <span className="hidden sm:block">|</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Bengaluru, Karnataka
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
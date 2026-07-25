/**
 * Chouhan Mattress - Order Confirmation & Receipt Page (/order-confirmation/[orderId])
 * Displays order status timeline, order details, receipt print button, and next steps
 */

'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import {
  CheckCircle2Icon,
  PackageIcon,
  TruckIcon,
  MapPinIcon,
  PrinterIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ClockIcon,
} from 'lucide-react';

import footerData from '@/data/footer.json';
import navigationData from '@/data/navigation.json';

const NAV_ITEMS = navigationData.primary.map((item) => ({
  label: item.label,
  href: item.href,
  children: [] as { label: string; href: string }[],
}));

const FOOTER_NAV_SECTIONS = [
  { title: 'Company', links: footerData.links.company },
  { title: 'Help & Support', links: footerData.links.help },
  { title: 'Shop', links: footerData.links.shop },
  { title: 'Policies', links: footerData.links.policies },
];

function OrderConfirmationContent() {
  const params = useParams();
  const orderId = (params?.orderId as string) || 'CM-894120';

  const orderDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  const deliveryDateString = estimatedDelivery.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <CartDrawer />
      <SearchModal />

      <Header
        brandName="Chouhan Mattress"
        brandLink="/"
        navItems={NAV_ITEMS}
        showCart
        showSearch
        showAccount
        showWishlist
        data-testid="main-header"
      />

      <main id="main-content" className="flex-1 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* ─── Hero Confirmation Banner ─── */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-xs space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2Icon className="w-12 h-12 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#F26522] uppercase tracking-wider block mb-1">
                  Thank You For Your Order!
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Order Confirmed
                </h1>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                  We’ve received your order and sent a confirmation SMS & email with your receipt details.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-xs font-mono font-bold text-gray-800">
                <span>Order ID:</span>
                <span className="text-[#F26522] font-black">{orderId}</span>
              </div>
            </div>

            {/* ─── Order Tracking Status Timeline ─── */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2 border-b border-gray-100 pb-4">
                <ClockIcon className="w-5 h-5 text-[#F26522]" />
                <span>Live Order Status Timeline</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {[
                  { title: 'Order Placed', desc: orderDate, status: 'completed' },
                  { title: 'Processing', desc: 'In Factory', status: 'active' },
                  { title: 'Dispatched', desc: 'Via Express Courier', status: 'upcoming' },
                  { title: 'Delivery', desc: `Est. ${deliveryDateString}`, status: 'upcoming' },
                ].map((step, idx) => (
                  <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        step.status === 'completed'
                          ? 'bg-green-600 text-white'
                          : step.status === 'active'
                          ? 'bg-[#F26522] text-white shadow-md'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                      <p className="text-xs text-gray-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Receipt Summary Details ─── */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="font-bold text-gray-900 text-lg">Order Receipt Summary</h2>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  <PrinterIcon className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-gray-600">
                <div>
                  <span className="font-bold text-gray-900 block mb-1">Delivery Address:</span>
                  <p className="text-gray-700 leading-relaxed">
                    Rahul Sharma<br />
                    Flat 402, Block B, Industrial Area Phase 2<br />
                    New Delhi, Delhi - 110020<br />
                    Phone: +91 9876543210
                  </p>
                </div>

                <div>
                  <span className="font-bold text-gray-900 block mb-1">Payment & Shipping:</span>
                  <p className="text-gray-700 leading-relaxed">
                    Payment Method: <span className="font-semibold text-gray-900">UPI Instant</span><br />
                    Shipping SLA: <span className="font-semibold text-green-700">Standard Free Delivery</span><br />
                    Estimated Delivery: <span className="font-semibold text-gray-900">{deliveryDateString}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <Link
                  href="/products"
                  className="flex-1 py-3.5 px-6 bg-[#F26522] text-white font-bold text-sm rounded-xl text-center hover:bg-[#d85519] transition-colors shadow-xs"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/account"
                  className="flex-1 py-3.5 px-6 bg-gray-900 text-white font-bold text-sm rounded-xl text-center hover:bg-gray-800 transition-colors"
                >
                  Track Order in Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

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
        newsletter={{
          placeholder: 'Enter your email',
          buttonText: 'Subscribe',
        }}
        contactInfo={{
          phone: footerData.company.phone,
          email: footerData.company.email,
          address: footerData.company.address,
          hours: footerData.company.hours,
        }}
        legalLinks={footerData.links.policies}
        showCopyright
        copyrightText={`© ${new Date().getFullYear()} Chouhan Mattress Private Limited. CIN: ${footerData.company.cin}`}
        data-testid="main-footer"
      />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Order Confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

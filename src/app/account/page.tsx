/**
 * Chouhan Mattress - User Account Dashboard (/account)
 * Profile Management, Live Order History & Tracking, Saved Addresses, & Support Requests
 */

'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Breadcrumbs } from '@/components/plp/Breadcrumbs';

import {
  UserIcon,
  PackageIcon,
  HeartIcon,
  MapPinIcon,
  HeadphonesIcon,
  LogOutIcon,
  CheckCircle2Icon,
  TruckIcon,
  ClockIcon,
  ChevronRightIcon,
  Edit2Icon,
  RotateCcwIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import footerData from '@/data/footer.json';
import navigationData from '@/data/navigation.json';
import productsData from '@/data/products.json';

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

const MOCK_ORDERS = [
  {
    id: 'CM-894120',
    date: '24 Jul 2026',
    status: 'Processing',
    statusColor: 'text-[#F26522] bg-orange-50 border-orange-200',
    estimatedDelivery: '29 Jul 2026',
    totalAmount: 7528,
    items: [
      {
        name: 'ShapeSense Orthopedic Essential Mattress',
        size: 'King Size (72x78 in)',
        quantity: 1,
        price: 6229,
        image: 'https://ik.imagekit.io/2xkwa8s1i/consumer-react/category-thumb/mattress-recommendation_desk2.jpg?tr=w-200',
      },
      {
        name: 'Memory Foam Pillow (Pack of 2)',
        size: 'Standard',
        quantity: 1,
        price: 1299,
        image: 'https://ik.imagekit.io/2xkwa8s1i/img/memory-foam-pillows/memory-foam-pillows-1-new.jpg?tr=w-200',
      },
    ],
  },
  {
    id: 'CM-712049',
    date: '10 Jan 2026',
    status: 'Delivered',
    statusColor: 'text-green-700 bg-green-50 border-green-200',
    estimatedDelivery: '15 Jan 2026',
    totalAmount: 24999,
    items: [
      {
        name: 'Dreamer 3-Seater Fabric Sofa',
        size: 'Grey Fabric',
        quantity: 1,
        price: 24999,
        image: 'https://ik.imagekit.io/2xkwa8s1i/img/npl_modified_images/Dreamer/WSFALGRL3CFMMGR1_LS_1.jpg?tr=w-200',
      },
    ],
  },
];

function AccountPageContent() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'support'>('orders');

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
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs items={[{ label: 'My Account', isCurrent: true }]} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar Navigation (3 Columns) */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-4 shadow-xs space-y-1">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-[#F26522] text-white font-bold text-lg flex items-center justify-center">
                  R
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">Rahul Sharma</h3>
                  <p className="text-xs text-gray-400 truncate">rahul.sharma@example.com</p>
                </div>
              </div>

              {[
                { id: 'orders', label: 'Order History & Tracking', icon: PackageIcon },
                { id: 'profile', label: 'Profile Details', icon: UserIcon },
                { id: 'addresses', label: 'Saved Delivery Addresses', icon: MapPinIcon },
                { id: 'support', label: 'Help & Returns Support', icon: HeadphonesIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl transition-all text-left cursor-pointer focus-visible:outline-none',
                      isActive
                        ? 'bg-[#F26522] text-white shadow-xs'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <Link
                href="/wishlist"
                className="w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl text-gray-600 hover:bg-gray-50 transition-all text-left"
              >
                <HeartIcon className="w-4 h-4 text-red-500" />
                <span>My Wishlist</span>
              </Link>
            </div>

            {/* Right Tab Content Area (9 Columns) */}
            <div className="lg:col-span-9 space-y-6">
              {/* Tab 1: Orders History */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Your Orders & Live Tracking</h2>
                    <span className="text-xs text-gray-500 font-semibold">{MOCK_ORDERS.length} Orders Placed</span>
                  </div>

                  <div className="space-y-6">
                    {MOCK_ORDERS.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-[#F26522] text-sm">{order.id}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">Placed on {order.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={cn('px-3 py-1 rounded-full text-xs font-bold border', order.statusColor)}>
                              ● {order.status}
                            </span>
                            <Link
                              href={`/order-confirmation/${order.id}`}
                              className="font-bold text-gray-900 hover:text-[#F26522] underline"
                            >
                              View Receipt
                            </Link>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center text-xs">
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                                <p className="text-gray-500">{item.size} (Qty: {item.quantity})</p>
                              </div>
                              <span className="font-extrabold text-gray-900 text-sm">
                                ₹{item.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <TruckIcon className="w-4 h-4 text-green-600" />
                            <span>Estimated Delivery: <strong className="text-gray-900">{order.estimatedDelivery}</strong></span>
                          </div>

                          <div className="font-extrabold text-gray-900 text-base">
                            Total Paid: <span className="text-[#F26522]">₹{order.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Profile Details */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                    Personal Profile Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Rahul Sharma"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Email Address</label>
                      <input
                        type="email"
                        defaultValue="rahul.sharma@example.com"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Mobile Phone</label>
                      <input
                        type="tel"
                        defaultValue="+91 9876543210"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Gender</label>
                      <select className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-900">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors">
                    Save Profile Changes
                  </button>
                </div>
              )}

              {/* Tab 3: Saved Addresses */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Delivery Addresses</h2>
                    <button className="px-4 py-2 bg-[#F26522] text-white font-bold text-xs rounded-xl hover:bg-[#d85519]">
                      + Add New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border-2 border-[#F26522] bg-orange-50/40 relative">
                      <span className="absolute top-3 right-3 bg-[#F26522] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        DEFAULT
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm">Rahul Sharma (Home)</h4>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        Flat 402, Block B, Industrial Area Phase 2<br />
                        New Delhi, Delhi - 110020<br />
                        Phone: +91 9876543210
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-gray-200 bg-white relative">
                      <h4 className="font-bold text-gray-900 text-sm">Rahul Sharma (Work)</h4>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        Chouhan Tech Tower, Floor 4<br />
                        Gurugram, Haryana - 122002<br />
                        Phone: +91 9876543210
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Support */}
              {activeTab === 'support' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                    Customer Support & Returns Portal
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200">
                      <HeadphonesIcon className="w-8 h-8 text-[#F26522] mb-2" />
                      <h4 className="font-bold text-gray-900 text-base">24/7 Priority Support</h4>
                      <p className="text-xs text-gray-600 mt-1">Call +91 9876543210 or email support@chouhanmattress.com</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-green-50 border border-green-200">
                      <RotateCcwIcon className="w-8 h-8 text-green-600 mb-2" />
                      <h4 className="font-bold text-gray-900 text-base">100-Night Trial Returns</h4>
                      <p className="text-xs text-gray-600 mt-1">Request free pickup for eligible 100-night trial mattresses.</p>
                    </div>
                  </div>
                </div>
              )}
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

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Account...</div>}>
      <AccountPageContent />
    </Suspense>
  );
}

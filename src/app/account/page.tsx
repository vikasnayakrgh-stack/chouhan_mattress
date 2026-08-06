'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Breadcrumbs } from '@/components/plp/Breadcrumbs';
import { useAccountLayout } from '@/app/account/AccountLayoutClient';

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
  SettingsIcon,
  BellIcon,
  ShieldIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

function AccountPageContent() {
  const { user, profile, addresses, repos, orders } = useAccountLayout();
  const [activeTab, setActiveTab] = useState<
    'orders' | 'profile' | 'addresses' | 'wishlist' | 'cart' | 'support' | 'settings'
  >('orders');
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch orders on mount and when tab changes
  React.useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, user?.id, repos]);

  const fetchOrders = async () => {
    // Orders are already passed from server via layout
    // This is handled by the server layout passing orders
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 font-sans">
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
      />

      <main id="main-content" className="flex-1 pb-16">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs items={[{ label: 'My Account', isCurrent: true }]} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar Navigation (3 Columns) */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-4 shadow-xs space-y-1 sticky top-24">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-[#F26522] text-white font-bold text-lg flex items-center justify-center">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">
                    {profile?.full_name || user.user_metadata?.full_name || 'Registered Customer'}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>

              {[
                { id: 'orders', label: 'Order History & Tracking', icon: PackageIcon, badge: orders?.length > 0 ? orders.length : null },
                { id: 'profile', label: 'Profile Details', icon: UserIcon },
                { id: 'addresses', label: 'Saved Addresses', icon: MapPinIcon, badge: addresses.length > 0 ? addresses.length : null },
                { id: 'wishlist', label: 'My Wishlist', icon: HeartIcon },
                { id: 'cart', label: 'Shopping Cart', icon: PackageIcon },
                { id: 'support', label: 'Help & Returns', icon: HeadphonesIcon },
                { id: 'settings', label: 'Account Settings', icon: SettingsIcon },
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
                    <span className="flex-1">{tab.label}</span>
                    {tab.badge !== null && tab.badge !== undefined && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/20 text-white">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer mt-2"
              >
                <LogOutIcon className="w-4 h-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Right Tab Content Area (9 Columns) */}
            <div className="lg:col-span-9 space-y-6">
              {/* Tab 1: Orders History */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Your Orders & Live Tracking</h2>
                    <span className="text-xs text-gray-500 font-semibold">{orders?.length || 0} Orders Placed</span>
                  </div>

                  <div className="space-y-6">
                    {orders?.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-xs">
                        <PackageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900 text-base">No orders placed yet</h3>
                        <p className="text-xs text-gray-500 mt-1">Your recent orders will appear here once placed.</p>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      orders?.map((order: any) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 text-xs">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-[#F26522] text-sm">{order.order_number}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={cn('px-3 py-1 rounded-full text-xs font-bold border capitalize text-[#F26522] bg-orange-50 border-orange-200')}>
                                ● {order.status}
                              </span>
                              <Link
                                href={`/order-confirmation/${order.order_number}`}
                                className="font-bold text-gray-900 hover:text-[#F26522] underline"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-4 items-center text-xs">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                                  <p className="text-gray-500">{item.size} (Qty: {item.quantity})</p>
                                </div>
                                <span className="font-extrabold text-gray-900 text-sm">
                                  ₹{item.unitPrice ? (item.unitPrice * item.quantity).toLocaleString() : '0'}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <TruckIcon className="w-4 h-4 text-green-600" />
                              <span>Status: <strong className="text-gray-900 uppercase">{order.payment_status}</strong></span>
                            </div>

                            <div className="font-extrabold text-gray-900 text-base">
                              Total Paid: <span className="text-[#F26522]">₹{order.total?.toLocaleString() || '0'}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
                        disabled
                        value={profile?.full_name || user.user_metadata?.full_name || ''}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user.email || ''}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        disabled
                        value={profile?.phone || user.user_metadata?.phone || ''}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">Account Created</label>
                      <input
                        type="text"
                        disabled
                        value={user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Link
                      href="/auth/login?redirectTo=/account/profile"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors"
                    >
                      Update Profile
                    </Link>
                  </div>
                </div>
              )}

              {/* Tab 3: Saved Addresses */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Delivery Addresses</h2>
                    <Link
                      href="/account/addresses/new"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors"
                    >
                      <span>+ Add New Address</span>
                    </Link>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center p-8 border border-gray-200 rounded-2xl border-dashed">
                      <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="font-bold text-gray-900 text-sm mb-1">No addresses saved yet</h3>
                      <p className="text-xs text-gray-500">Save addresses for faster checkout.</p>
                      <Link
                        href="/account/addresses/new"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors"
                      >
                        Add Your First Address
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((address: any) => (
                        <div
                          key={address.id}
                          className="p-4 border border-gray-200 rounded-2xl relative"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-gray-900 text-sm">{address.label || address.type}</span>
                                {address.is_default_shipping && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700">Default Shipping</span>
                                )}
                                {address.is_default_billing && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">Default Billing</span>
                                )}
                              </div>
                              <p className="font-bold text-gray-900 text-sm">{address.full_name}</p>
                              <p className="text-xs text-gray-500">{address.phone}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {address.line1}
                                {address.line2 && `, ${address.line2}`}
                                <br />
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => repos.customerAddresses.setDefault(address.customer_id, address.id, 'shipping')}
                                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              >
                                Set Shipping
                              </button>
                              <button
                                onClick={() => repos.customerAddresses.setDefault(address.customer_id, address.id, 'billing')}
                                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              >
                                Set Billing
                              </button>
                              <button
                                onClick={() => repos.customerAddresses.delete(address.id)}
                                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Wishlist */}
              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <HeartIcon className="w-5 h-5 text-red-500 fill-red-500" />
                      <span>My Wishlist</span>
                    </h2>
                  </div>
                  <div className="text-center p-8 border border-gray-200 rounded-2xl border-dashed">
                    <HeartIcon className="w-12 h-12 text-red-300 mx-auto mb-3 fill-red-300" />
                    <p className="text-xs text-gray-500">Your saved items will appear here. Feature coming soon!</p>
                  </div>
                </div>
              )}

              {/* Tab 5: Cart */}
              {activeTab === 'cart' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <PackageIcon className="w-5 h-5 text-[#F26522]" />
                      <span>Shopping Cart</span>
                    </h2>
                  </div>
                  <div className="text-center p-8 border border-gray-200 rounded-2xl border-dashed">
                    <PackageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-xs text-gray-500">Your cart items will appear here. Feature coming soon!</p>
                  </div>
                </div>
              )}

              {/* Tab 6: Support */}
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

                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
                      <ShieldIcon className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-bold text-gray-900 text-base">10-Year Warranty</h4>
                      <p className="text-xs text-gray-600 mt-1">Direct sagging replacement coverage on all mattresses.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200">
                      <TruckIcon className="w-8 h-8 text-purple-600 mb-2" />
                      <h4 className="font-bold text-gray-900 text-base">Free White-Glove Delivery</h4>
                      <p className="text-xs text-gray-600 mt-1">Free unboxing & setup in 150+ cities across India.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 7: Settings */}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                    Account Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BellIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">Email Notifications</h4>
                          <p className="text-xs text-gray-500">Order updates, promotions, and news</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F26522]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F26522]"></div>
                      </label>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BellIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">SMS Notifications</h4>
                          <p className="text-xs text-gray-500">Order tracking and delivery alerts</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F26522]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F26522]"></div>
                      </label>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">Two-Factor Authentication</h4>
                          <p className="text-xs text-gray-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <Link href="/account/settings/security" className="text-xs font-bold text-[#F26522] hover:underline">
                        Enable
                      </Link>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RotateCcwIcon className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">Delete Account</h4>
                          <p className="text-xs text-gray-500">Permanently remove your data</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-red-600 hover:underline">Delete Account</button>
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
        socialLinks={[]}
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
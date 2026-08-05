/**
 * Chouhan Mattress - User Account Dashboard (/account)
 * Profile Management, Live Order History & Tracking, Saved Addresses, & Support Requests
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Breadcrumbs } from '@/components/plp/Breadcrumbs';
import { supabase } from '@/lib/supabase/client';

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'support'>('orders');
  const [orders, setOrders] = useState<any[]>([]);

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          // Fetch real user orders
          const { data: userOrders } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (userOrders) {
            setOrders(userOrders);
          }
        }
      } catch (err) {
        console.error('Failed to get session:', err);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }

      if (data?.session) {
        const { access_token, expires_in } = data.session;
        document.cookie = `sb-access-token=${access_token}; path=/; max-age=${expires_in}; SameSite=Lax; Secure`;
        window.location.reload();
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#F26522] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Verifying Account Status...</p>
        </div>
      </div>
    );
  }

  // Render Login Form if NOT Authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <CartDrawer />
        <SearchModal />
        <Header brandName="Chouhan Mattress" brandLink="/" navItems={NAV_ITEMS} showCart showSearch showAccount showWishlist />
        
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Portal</h2>
              <p className="mt-2 text-sm text-gray-500">Sign in to track orders, manage addresses, and view history</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleLogin}>
              {authError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-500">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26522]"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26522]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-xs text-sm font-bold text-white bg-[#F26522] hover:bg-[#d85519] focus:outline-none disabled:opacity-50 cursor-pointer"
              >
                {authLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </main>
        
        <Footer brandName="Chouhan Mattress" brandDescription={footerData.company.description} navSections={FOOTER_NAV_SECTIONS} socialLinks={[]} legalLinks={[]} />
      </div>
    );
  }

  // Render Authenticated Dashboard
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
            <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 p-4 shadow-xs space-y-1">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-[#F26522] text-white font-bold text-lg flex items-center justify-center">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm truncate">{user.user_metadata?.name || 'Registered Customer'}</h3>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
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

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer"
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
                    <span className="text-xs text-gray-500 font-semibold">{orders.length} Orders Placed</span>
                  </div>

                  <div className="space-y-6">
                    {orders.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-xs">
                        <PackageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900 text-base">No orders placed yet</h3>
                        <p className="text-xs text-gray-500 mt-1">Your recent orders will appear here once placed.</p>
                      </div>
                    ) : (
                      orders.map((order) => (
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
                                View Receipt
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
                      <label className="text-xs font-bold text-gray-500 block mb-1">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user.email || ''}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Saved Addresses */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Delivery Addresses</h2>
                  </div>

                  <div className="text-center p-8 border border-gray-200 rounded-2xl border-dashed">
                    <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-xs text-gray-500">Addresses from your checkout process will appear here.</p>
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

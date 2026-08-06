'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';

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

function ForgotPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/auth/login';
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Failed to send reset email');
        return;
      }
      
      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
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
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Chouhan <span className="text-[#F26522]">Mattress</span>
              </span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reset Your Password</h2>
            <p className="mt-2 text-sm text-gray-500">Enter your email and we'll send you a reset link</p>
          </div>
          
          {success ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-xs font-semibold text-green-700">
                {error || 'If an account with that email exists, a password reset link has been sent.'}
              </div>
              <p className="text-center text-sm text-gray-500">
                Check your inbox (and spam folder) for the reset email.
              </p>
              <div className="text-center">
                <Link href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`} className="font-bold text-[#F26522] hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-500">
                  {error}
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
                {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#F26522] hover:bg-[#d85519] focus:outline-none disabled:opacity-50 cursor-pointer transition-all"
              >
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>
          )}
          
          <p className="text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`} className="font-bold text-[#F26522] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
      
      <Footer
        brandName="Chouhan Mattress"
        brandDescription={footerData.company.description}
        navSections={FOOTER_NAV_SECTIONS}
        socialLinks={[]}
        legalLinks={[]}
      />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { createClient } from '@supabase/supabase-js';

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (!token || type !== 'recovery') {
      setTokenValid(false);
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }
  }, [searchParams]);

  const validateForm = () => {
    let valid = true;
    
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    } else {
      setConfirmError('');
    }
    
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !tokenValid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        if (error.message.includes('Token has expired')) {
          setError('This reset link has expired. Please request a new one.');
        } else if (error.message.includes('Invalid token')) {
          setError('Invalid reset link. Please request a new one.');
        } else {
          setError(error.message);
        }
        return;
      }
      
      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
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
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚠
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
              <p className="mt-2 text-sm text-gray-500">{error || 'This password reset link is invalid or has expired.'}</p>
              <div className="mt-6">
                <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors">
                  Request New Link
                </Link>
              </div>
            </div>
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

  if (success) {
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
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Password Reset Successful</h2>
              <p className="mt-2 text-sm text-gray-500">Your password has been updated. You can now sign in with your new password.</p>
              <div className="mt-6">
                <Link href="/auth/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
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
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Set New Password</h2>
            <p className="mt-2 text-sm text-gray-500">Your new password must be different from previously used passwords</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-500">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26522]"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26522]"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {confirmError && <p className="mt-1 text-xs text-red-500">{confirmError}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#F26522] hover:bg-[#d85519] focus:outline-none disabled:opacity-50 cursor-pointer transition-all"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500">
            <Link href="/auth/login" className="font-bold text-[#F26522] hover:underline">
              Back to Sign In
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
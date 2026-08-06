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

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';
  const errorParam = searchParams.get('error');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorParam || null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Login failed');
        if (data.code === 'EMAIL_NOT_VERIFIED') {
          // Could redirect to verify page
        }
        return;
      }
      
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
          </div>
          
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
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-2 appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26522]"
                placeholder="name@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <Link
                  href={`/auth/forgot-password?redirectTo=${encodeURIComponent(redirectTo)}`}
                  className="text-xs font-bold text-[#F26522] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="mt-2 appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26522]"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => handleChange('rememberMe', e.target.checked)}
                className="w-4 h-4 text-[#F26522] border-gray-300 rounded focus:ring-[#F26522]"
              />
              <label htmlFor="rememberMe" className="text-xs text-gray-600">
                Remember me for 30 days
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#F26522] hover:bg-[#d85519] focus:outline-none disabled:opacity-50 cursor-pointer transition-all"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href={`/auth/signup?redirectTo=${encodeURIComponent(redirectTo)}`} className="font-bold text-[#F26522] hover:underline">
              Create Account
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
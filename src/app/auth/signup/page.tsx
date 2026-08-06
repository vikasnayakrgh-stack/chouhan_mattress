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

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    marketingOptIn: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid Indian phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName.trim(),
          phone: formData.phone || undefined,
          marketingOptIn: formData.marketingOptIn,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/auth/verify-email?redirectTo=${encodeURIComponent(redirectTo)}`);
      }, 2000);
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
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Created!</h2>
              <p className="mt-2 text-sm text-gray-500">Please check your email to verify your account.</p>
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
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Your Account</h2>
            <p className="mt-2 text-sm text-gray-500">Join thousands of happy sleepers</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-500">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="mt-2 appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26522]"
                placeholder="Rahul Sharma"
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>
            
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
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number (Optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                maxLength={10}
                className="mt-2 appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26522]"
                placeholder="9876543210"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
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
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="mt-2 appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#F26522]"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="marketingOptIn"
                checked={formData.marketingOptIn}
                onChange={(e) => handleChange('marketingOptIn', e.target.checked)}
                className="w-4 h-4 text-[#F26522] border-gray-300 rounded focus:ring-[#F26522]"
              />
              <label htmlFor="marketingOptIn" className="text-xs text-gray-600">
                I'd like to receive updates about offers and new products
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#F26522] hover:bg-[#d85519] focus:outline-none disabled:opacity-50 cursor-pointer transition-all"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <SignupPageContent />
    </Suspense>
  );
}
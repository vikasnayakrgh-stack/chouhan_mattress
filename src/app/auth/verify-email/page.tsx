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

function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/account';
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'resend'>('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'signup') {
      verifyEmail(token);
    } else if (!token) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const hashToken = params.get('token');
      const hashType = params.get('type');
      
      if (hashToken && hashType === 'signup') {
        verifyEmail(hashToken);
      } else {
        setStatus('resend');
        setMessage('No verification token found. You can request a new verification email.');
      }
    }
  }, [searchParams, router]);

  const verifyEmail = async (token: string) => {
    setLoading(true);
    setStatus('verifying');
    setMessage('Verifying your email...');
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup',
      });
      
      if (error) {
        if (error.message.includes('expired') || error.message.includes('invalid')) {
          setStatus('error');
          setMessage('This verification link has expired or is invalid. Please request a new one.');
        } else {
          setStatus('error');
          setMessage(error.message);
        }
        return;
      }
      
      if (data.session) {
        const response = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
            redirectTo,
          }),
        });
        
        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to your account...');
          setTimeout(() => {
            router.push(redirectTo);
            router.refresh();
          }, 2000);
        } else {
          setStatus('success');
          setMessage('Email verified! Please sign in to continue.');
          setTimeout(() => {
            router.push(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
          }, 2000);
        }
      } else {
        setStatus('success');
        setMessage('Email verified! Please sign in to continue.');
        setTimeout(() => {
          router.push(`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
        }, 2000);
      }
    } catch (err) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    const email = searchParams.get('email');
    if (!email) {
      setMessage('Please provide your email to resend verification.');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });
      
      if (error) {
        setMessage('Failed to resend verification email. Please try again.');
      } else {
        setMessage('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    verifying: { icon: '⟳', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    success: { icon: '✓', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    error: { icon: '⚠', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    resend: { icon: '✉', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
  };

  const config = statusConfig[status];

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
            
            <div className={`w-16 h-16 rounded-full ${config.bg} ${config.color} flex items-center justify-center mx-auto mb-4 text-2xl animate-pulse`}>
              {config.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {status === 'verifying' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
              {status === 'resend' && 'Verify Your Email'}
            </h2>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </div>
          
          {(status === 'error' || status === 'resend') && (
            <div className="space-y-4">
              <button
                onClick={resendVerification}
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#F26522] hover:bg-[#d85519] focus:outline-none disabled:opacity-50 cursor-pointer transition-all"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
              {status === 'error' && (
                <p className="text-center text-sm text-gray-500">
                  Didn't receive the email?{' '}
                  <Link href="/auth/signup" className="font-bold text-[#F26522] hover:underline">
                    Create a new account
                  </Link>
                </p>
              )}
            </div>
          )}
          {status === 'success' && (
            <div className="text-center mt-6">
              <Link href={redirectTo} className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors">
                Continue to Account
              </Link>
            </div>
          )}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
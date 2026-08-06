'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Breadcrumbs } from '@/components/plp/Breadcrumbs';
import { useAccountLayout } from '@/app/account/AccountLayoutClient';

import {
  MapPinIcon,
  ArrowLeftIcon,
  SaveIcon,
  XIcon,
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

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

function AddressForm({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  loading 
}: {
  initialData?: Partial<{
  type: 'shipping' | 'billing' | 'both';
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    type: 'shipping',
    label: '',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isDefaultShipping: false,
    isDefaultBilling: false,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Invalid Indian phone number';
    
    if (!formData.line1.trim()) newErrors.line1 = 'Address line 1 is required';
    else if (formData.line1.trim().length < 5) newErrors.line1 = 'Address too short';
    
    if (!formData.city.trim()) newErrors.city = 'City is required';
    else if (formData.city.trim().length < 2) newErrors.city = 'City name too short';
    
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid PIN code (must be 6 digits)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev: typeof formData) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: typeof errors) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Address Type</label>
          <div className="flex gap-4">
            {(['shipping', 'billing', 'both'] as const).map((type) => (
              <label
                key={type}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all',
                  formData.type === type
                    ? 'bg-[#F26522] border-[#F26522] text-white'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={formData.type === type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="text-[#F26522] focus:ring-[#F26522]"
                />
                <span className="font-bold text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Label (Optional)</label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]"
            placeholder="Home, Office, Mom's House"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]"
            placeholder="Rahul Sharma"
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number *</label>
          <input
            type="tel"
            required
            maxLength={10}
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]"
            placeholder="9876543210"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">PIN Code *</label>
          <input
            type="text"
            required
            maxLength={6}
            value={formData.pincode}
            onChange={(e) => handleChange('pincode', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]"
            placeholder="110001"
          />
          {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">City *</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]"
            placeholder="New Delhi"
          />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">State *</label>
          <select
            required
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]"
          >
            <option value="">Select State</option>
            {STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Flat / House No / Building Name *</label>
          <input
            type="text"
            required
            value={formData.line1}
            onChange={(e) => handleChange('line1', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]"
            placeholder="A-101, Sunrise Apartments"
          />
          {errors.line1 && <p className="mt-1 text-xs text-red-500">{errors.line1}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Street Address & Landmark *</label>
          <input
            type="text"
            required
            value={formData.line2}
            onChange={(e) => handleChange('line2', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F26522]"
            placeholder="Near Metro Station, Sector 5"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isDefaultShipping}
            onChange={(e) => handleChange('isDefaultShipping', e.target.checked)}
            className="w-4 h-4 text-[#F26522] border-gray-300 rounded focus:ring-[#F26522]"
          />
          <span className="text-sm font-medium text-gray-700">Set as default shipping address</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isDefaultBilling}
            onChange={(e) => handleChange('isDefaultBilling', e.target.checked)}
            className="w-4 h-4 text-[#F26522] border-gray-300 rounded focus:ring-[#F26522]"
          />
          <span className="text-sm font-medium text-gray-700">Set as default billing address</span>
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50"
        >
          <XIcon className="w-5 h-5 inline mr-1" /> Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-[#F26522] text-white font-black text-sm rounded-xl hover:bg-[#d85519] transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <SaveIcon className="w-5 h-5" />
          {loading ? 'Saving...' : initialData ? 'Update Address' : 'Save Address'}
        </button>
      </div>
    </form>
  );
}

export default function AddressNewPage() {
  const { user, repos } = useAccountLayout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const address = await repos.customerAddresses.create({
        customer_id: user.id,
        ...data,
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/account/addresses';
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/account/addresses';
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
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Address Saved!</h2>
            <p className="mt-2 text-sm text-gray-500">Your new address has been added successfully.</p>
            <Link
              href="/account/addresses"
              className="inline-flex items-center gap-2 mt-6 px-8 py-3.5 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors"
            >
              View All Addresses
            </Link>
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
          <Breadcrumbs items={[
            { label: 'My Account', href: '/account' },
            { label: 'Addresses', href: '/account/addresses' },
            { label: 'Add New Address', isCurrent: true }
          ]} />
          
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Add New Address</h1>
                <p className="text-sm text-gray-500 mt-1">Save this address for faster checkout</p>
              </div>
              <Link
                href="/account/addresses"
                className="text-xs font-bold text-[#F26522] hover:underline flex items-center gap-1"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Addresses
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
              <AddressForm
                initialData={{}}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
              />
              
              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-500">
                  {error}
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
        legalLinks={[]}
      />
    </div>
  );
}
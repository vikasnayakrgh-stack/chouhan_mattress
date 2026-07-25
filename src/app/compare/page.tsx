/**
 * Chouhan Mattress - Side-by-Side Product Comparison Tool (/compare)
 * Interactive spec matrix comparing firmness, thickness, layers, trial, warranty, and pricing
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

import { useCart } from '@/context/CartContext';
import productsData from '@/data/products.json';
import footerData from '@/data/footer.json';
import navigationData from '@/data/navigation.json';
import { StarIcon, ShoppingCartIcon, CheckIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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

function ComparePageContent() {
  const { addItem } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2']);

  const comparedProducts = selectedIds
    .map((id) => productsData.find((p) => String(p.id) === String(id)))
    .filter(Boolean) as typeof productsData;

  const handleSelectProduct = (index: number, newId: string) => {
    const updated = [...selectedIds];
    updated[index] = newId;
    setSelectedIds(updated);
  };

  const handleRemoveColumn = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleAddColumn = () => {
    const nextUnselected = productsData.find((p) => !selectedIds.includes(String(p.id)));
    if (nextUnselected) {
      setSelectedIds((prev) => [...prev, String(nextUnselected.id)]);
    }
  };

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
          <Breadcrumbs items={[{ label: 'Product Comparison', isCurrent: true }]} />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Compare Products Side-by-Side
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Compare specs, firmness, warranty, layer materials, and prices to find the perfect fit.
              </p>
            </div>

            {selectedIds.length < 4 && (
              <button
                onClick={handleAddColumn}
                className="px-4 py-2.5 bg-gray-900 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-gray-800 transition-colors self-start sm:self-auto"
              >
                + Add Product to Compare
              </button>
            )}
          </div>

          {/* ─── Comparison Matrix Table ─── */}
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-5 w-64 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Feature Specifications
                  </th>
                  {comparedProducts.map((p, idx) => (
                    <th key={p.id} className="p-5 min-w-[240px] relative vertical-top">
                      {comparedProducts.length > 1 && (
                        <button
                          onClick={() => handleRemoveColumn(String(p.id))}
                          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                          title="Remove from comparison"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      )}

                      {/* Product Selector Dropdown */}
                      <select
                        value={String(p.id)}
                        onChange={(e) => handleSelectProduct(idx, e.target.value)}
                        className="w-full mb-3 text-xs font-bold bg-white border border-gray-200 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      >
                        {productsData.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>

                      <div className="relative w-28 h-28 mx-auto mb-3 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                        <Image src={p.thumbnail} alt={p.name} fill className="object-cover" />
                      </div>

                      <h3 className="font-bold text-gray-900 text-sm text-center line-clamp-2 h-10">
                        {p.name}
                      </h3>

                      <div className="text-center mt-2">
                        <div className="text-lg font-black text-gray-900">
                          ₹{p.price.toLocaleString()}
                        </div>
                        <span className="text-xs text-green-700 font-bold">
                          {p.discount}% OFF
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          addItem({
                            productId: String(p.id),
                            name: p.name,
                            price: p.price,
                            originalPrice: p.originalPrice,
                            quantity: 1,
                            image: p.thumbnail,
                          })
                        }
                        className="w-full mt-3 py-2 px-3 bg-[#F26522] text-white font-bold text-xs rounded-xl hover:bg-[#d85519] transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingCartIcon className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-700">
                {/* Rating */}
                <tr>
                  <td className="p-5 font-bold text-gray-900 bg-gray-50/30">Customer Rating</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-5 text-center">
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200 font-bold">
                        <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {p.rating} ({p.reviewCount})
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Firmness Level */}
                <tr>
                  <td className="p-5 font-bold text-gray-900 bg-gray-50/30">Firmness Scale</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-5 text-center font-bold text-gray-900">
                      {p.firmness || 'Medium Firm (7/10)'}
                    </td>
                  ))}
                </tr>

                {/* Thickness Options */}
                <tr>
                  <td className="p-5 font-bold text-gray-900 bg-gray-50/30">Available Thickness</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-5 text-center font-semibold text-gray-700">
                      {p.thickness?.join(', ') || '6", 8", 10"'}
                    </td>
                  ))}
                </tr>

                {/* Primary Material */}
                <tr>
                  <td className="p-5 font-bold text-gray-900 bg-gray-50/30">Primary Layer Material</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-5 text-center text-gray-700">
                      {p.material || 'Orthopedic Support Foam'}
                    </td>
                  ))}
                </tr>

                {/* Trial Period */}
                <tr>
                  <td className="p-5 font-bold text-gray-900 bg-gray-50/30">Risk-Free Trial</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-5 text-center font-bold text-green-700">
                      {p.trial || '100 Nights'}
                    </td>
                  ))}
                </tr>

                {/* Warranty */}
                <tr>
                  <td className="p-5 font-bold text-gray-900 bg-gray-50/30">Warranty Period</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-5 text-center font-bold text-gray-900">
                      {p.warranty || '10 Years'}
                    </td>
                  ))}
                </tr>

                {/* Free Installation */}
                <tr>
                  <td className="p-5 font-bold text-gray-900 bg-gray-50/30">Free Assembly / Setup</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-5 text-center text-green-700 font-bold">
                      ✓ Included
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
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

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Comparison...</div>}>
      <ComparePageContent />
    </Suspense>
  );
}

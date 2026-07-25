/**
 * Chouhan Mattress - Wishlist Page (/wishlist)
 * Displays saved favorite products with quick Move-to-Cart actions
 */

'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { ProductGrid } from '@/components/library/ProductGrid';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Breadcrumbs } from '@/components/plp/Breadcrumbs';

import { useCart } from '@/context/CartContext';
import productsData from '@/data/products.json';
import footerData from '@/data/footer.json';
import navigationData from '@/data/navigation.json';
import { HeartIcon, ShoppingCartIcon } from 'lucide-react';

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

function WishlistPageContent() {
  const { addItem } = useCart();
  const [wishlistItems, setWishlistItems] = useState(productsData.slice(0, 3));

  const handleRemoveFromWishlist = (id: string | number) => {
    setWishlistItems((prev) => prev.filter((p) => String(p.id) !== String(id)));
  };

  const handleMoveToCart = (product: any) => {
    addItem({
      productId: String(product.id),
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: 1,
      image: product.thumbnail || product.images[0],
      size: 'Queen Size (60x78 in)',
    });
    handleRemoveFromWishlist(product.id);
  };

  const gridProducts = wishlistItems.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    primaryImage: p.thumbnail || p.images[0],
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    discount: p.discount,
    rating: p.rating,
    reviewCount: p.reviewCount,
    thumbnail: p.thumbnail,
    images: p.images,
    href: `/product/${p.id}`,
    badges: p.badges?.map((b: string) => ({
      text: b,
      variant: b.includes('%') ? ('warning' as const) : ('primary' as const),
    })),
    inStock: p.inStock,
    category: p.category,
    delivery: p.delivery,
  }));

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
          <Breadcrumbs items={[{ label: 'My Wishlist', isCurrent: true }]} />

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <HeartIcon className="w-8 h-8 text-red-500 fill-red-500" />
              <span>My Saved Wishlist</span>
              <span className="text-sm font-semibold bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                {wishlistItems.length} Saved
              </span>
            </h1>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="py-20 bg-white rounded-3xl border border-gray-100 p-8 text-center max-w-xl mx-auto shadow-xs">
              <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-3xl">
                ❤️
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">
                Explore our collection and click the heart icon to save products to your wishlist.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F26522] text-white font-bold text-sm rounded-xl hover:bg-[#d85519] transition-colors"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <ProductGrid
              products={gridProducts}
              columns={4}
              gap="md"
              variant="grid"
              showActions
              showBadges
              showRating
              onAddToCart={(p) => handleMoveToCart(p)}
              onToggleWishlist={(p) => handleRemoveFromWishlist(p.id)}
            />
          )}
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

export default function WishlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Wishlist...</div>}>
      <WishlistPageContent />
    </Suspense>
  );
}

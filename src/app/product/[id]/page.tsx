/**
 * Chouhan Mattress - Product Detail Page (PDP) Route (/product/[id])
 * Full-featured PDP with gallery zoom, variant selector, custom dimension calculator,
 * pincode SLA checker, specs tabs, verified reviews, sticky buy bar, and related cross-sells
 */

'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/library/Header';
import { Footer } from '@/components/library/Footer';
import { ProductGrid } from '@/components/library/ProductGrid';
import { SearchModal } from '@/components/search/SearchModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Breadcrumbs } from '@/components/plp/Breadcrumbs';

import { ImageGallery } from '@/components/pdp/ImageGallery';
import { VariantSelector } from '@/components/pdp/VariantSelector';
import { CustomDimensionCalculator } from '@/components/pdp/CustomDimensionCalculator';
import { PincodeChecker } from '@/components/pdp/PincodeChecker';
import { ProductTabs } from '@/components/pdp/ProductTabs';
import { ReviewsSection } from '@/components/pdp/ReviewsSection';
import { StickyAddToCartBar } from '@/components/pdp/StickyAddToCartBar';
import { VariantBottomSheet } from '@/components/pdp/VariantBottomSheet';

import { CustomDimension, ProductVariantOption } from '@/types/pdp';
import productsData from '@/data/products.json';
import footerData from '@/data/footer.json';
import navigationData from '@/data/navigation.json';
import { StarIcon, ShoppingCartIcon, ZapIcon, ShieldCheckIcon, RotateCcwIcon, TruckIcon } from 'lucide-react';

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

function ProductDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '1';

  // Find product by id or slug in productsData
  const product = useMemo(() => {
    const rawId = String(id).toLowerCase();
    return (
      productsData.find((p) => String(p.id) === rawId) ||
      productsData.find((p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(rawId)) ||
      productsData.find((p) => rawId.includes(p.name.toLowerCase().split(' ')[0])) ||
      productsData.find((p) => p.subcategory && rawId.includes(p.subcategory)) ||
      productsData[0]
    );
  }, [id]);

  // Map variants
  const defaultVariants: ProductVariantOption[] = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.map((v: any, idx: number) => ({
        id: `var-${idx}`,
        size: v.size || 'King',
        dimensions: v.dimensions,
        price: v.price || product.price,
        originalPrice: product.originalPrice,
        stock: v.stock || 50,
      }));
    }
    return [
      { id: 'var-1', size: 'Single', dimensions: '36x75 in', price: Math.round(product.price * 0.8), originalPrice: Math.round(product.originalPrice * 0.8), stock: 50 },
      { id: 'var-2', size: 'Double', dimensions: '48x78 in', price: Math.round(product.price * 0.9), originalPrice: Math.round(product.originalPrice * 0.9), stock: 65 },
      { id: 'var-3', size: 'Queen', dimensions: '60x78 in', price: product.price, originalPrice: product.originalPrice, stock: 100 },
      { id: 'var-4', size: 'King', dimensions: '72x78 in', price: Math.round(product.price * 1.15), originalPrice: Math.round(product.originalPrice * 1.15), stock: 80 },
    ];
  }, [product]);

  // ─── State ───
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantOption>(defaultVariants[2] || defaultVariants[0]);
  const [selectedThickness, setSelectedThickness] = useState<string>(product.thickness?.[0] || '8 Inch');
  const [isCustomSelected, setIsCustomSelected] = useState<boolean>(false);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [customDimension, setCustomDimension] = useState<CustomDimension | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [isVariantSheetOpen, setIsVariantSheetOpen] = useState<boolean>(false);

  // Computed current price
  const displayPrice = isCustomSelected && customPrice ? customPrice : selectedVariant.price;
  const displayOriginalPrice = isCustomSelected && customPrice ? Math.round(customPrice * 1.8) : (selectedVariant.originalPrice || product.originalPrice);
  const discountPercent = Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100);

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    router.push('/checkout');
  };

  const handleApplyCustomSize = (dim: CustomDimension, price: number) => {
    setCustomDimension(dim);
    setCustomPrice(price);
    setIsCustomSelected(true);
  };

  // Related products
  const relatedProducts = useMemo(() => {
    return productsData
      .filter((p) => String(p.id) !== String(id))
      .slice(0, 4)
      .map((p) => ({
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
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CartDrawer />
      <SearchModal />

      {/* Header */}
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
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/category/${product.category}` },
              { label: product.name, isCurrent: true },
            ]}
          />

          {/* Toast Alert */}
          {addedToast && (
            <div className="fixed top-20 right-6 z-50 bg-[#121212] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-orange-500/30 animate-bounce">
              <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <div>
                <p className="font-bold text-sm">Added to Cart!</p>
                <p className="text-xs text-gray-400">
                  {product.name} ({isCustomSelected ? 'Custom Size' : selectedVariant.size})
                </p>
              </div>
            </div>
          )}

          {/* ─── PDP Top Section: Gallery & Buying Box ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-start">
            {/* Left: Image Gallery (7 Columns) */}
            <div className="lg:col-span-7">
              <ImageGallery
                images={product.images || [product.thumbnail]}
                productName={product.name}
                badges={product.badges?.map((b: string) => ({ text: b }))}
              />
            </div>

            {/* Right: Product Purchase Box (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Product Title & Ratings */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">
                  {product.description}
                </p>

                {/* Rating Bar */}
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 text-xs font-bold">
                    <StarIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{product.rating}</span>
                  </div>
                  <a href="#reviews-section" className="text-xs text-gray-500 font-semibold underline hover:text-[#F26522]">
                    {product.reviewCount?.toLocaleString()} Verified Reviews
                  </a>
                  <span className="text-gray-300">|</span>
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-gray-900">
                      ₹{displayPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{displayOriginalPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#F26522] block mt-0.5">
                    Inclusive of all taxes & Free Doorstep Shipping
                  </span>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 bg-[#F26522] text-white text-xs font-black rounded-full shadow-xs">
                    {discountPercent}% OFF
                  </span>
                </div>
              </div>

              {/* Variant Selector */}
              <VariantSelector
                variants={defaultVariants}
                selectedVariant={selectedVariant}
                onSelectVariant={(v) => {
                  setSelectedVariant(v);
                  setIsCustomSelected(false);
                }}
                availableThicknesses={product.thickness || ['6 Inch', '8 Inch', '10 Inch']}
                selectedThickness={selectedThickness}
                onSelectThickness={setSelectedThickness}
                isCustomSelected={isCustomSelected}
                onToggleCustom={() => setIsCustomSelected(!isCustomSelected)}
              />

              {/* Custom Dimension Calculator Dropdown */}
              {isCustomSelected && (
                <CustomDimensionCalculator
                  basePrice={product.price}
                  onApplyCustomSize={handleApplyCustomSize}
                />
              )}

              {/* Quantity & CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 focus-visible:outline-none shadow-sm"
                  >
                    <ShoppingCartIcon className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 bg-[#F26522] text-white font-black text-base rounded-xl hover:bg-[#d85519] transition-colors flex items-center justify-center gap-2 shadow-md focus-visible:outline-none"
                >
                  <ZapIcon className="w-5 h-5 fill-white" />
                  <span>Buy Now — Instant Checkout</span>
                </button>
              </div>

              {/* Pincode SLA Checker */}
              <PincodeChecker />

              {/* Trust Callouts */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-gray-600 border-t border-gray-100">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <ShieldCheckIcon className="w-5 h-5 text-[#F26522] mx-auto mb-1" />
                  <span className="font-bold block text-gray-900">{product.warranty || '10 Years'}</span>
                  <span>Warranty</span>
                </div>
                <div className="p-2 bg-gray-50 rounded-xl">
                  <RotateCcwIcon className="w-5 h-5 text-[#F26522] mx-auto mb-1" />
                  <span className="font-bold block text-gray-900">{product.trial || '100 Nights'}</span>
                  <span>Free Trial</span>
                </div>
                <div className="p-2 bg-gray-50 rounded-xl">
                  <TruckIcon className="w-5 h-5 text-[#F26522] mx-auto mb-1" />
                  <span className="font-bold block text-gray-900">Free</span>
                  <span>Shipping</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── PDP Bottom Section: Tabs & Reviews ─── */}
          <div className="space-y-12">
            {/* Product Specifications & FAQ Tabs */}
            <ProductTabs
              description={product.description}
              features={product.features}
              material={product.material}
              warranty={product.warranty}
              trial={product.trial}
              specifications={{
                'Brand': 'Chouhan Mattress',
                'Firmness Level': product.firmness || 'Medium Firm',
                'Primary Material': product.material || 'High Density Orthopedic Foam',
                'Warranty Period': product.warranty || '10 Years',
                'Trial Period': product.trial || '100 Nights',
                'Cover Material': 'Hypoallergenic Breathable Knit',
                'Country of Origin': 'India',
              }}
            />

            {/* Verified Buyer Reviews */}
            <div id="reviews-section">
              <ReviewsSection rating={product.rating} reviewCount={product.reviewCount} />
            </div>

            {/* Related Cross-Sell Recommendations */}
            {relatedProducts.length > 0 && (
              <div className="pt-8 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  You Might Also Like
                </h3>
                <ProductGrid
                  products={relatedProducts}
                  columns={4}
                  gap="md"
                  variant="grid"
                  showActions
                  showBadges
                  showRating
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Sticky Add-to-Cart Bar on Scroll */}
      <StickyAddToCartBar
        productName={product.name}
        thumbnail={product.thumbnail}
        selectedSize={isCustomSelected ? 'Custom Size' : selectedVariant.size || 'Queen'}
        selectedThickness={selectedThickness}
        price={displayPrice}
        originalPrice={displayOriginalPrice}
        onAddToCart={() => {
          if (window.innerWidth < 768) {
            setIsVariantSheetOpen(true);
          } else {
            handleAddToCart();
          }
        }}
        onBuyNow={() => {
          if (window.innerWidth < 768) {
            setIsVariantSheetOpen(true);
          } else {
            handleBuyNow();
          }
        }}
      />

      {/* Native Mobile Variant Selector Bottom Sheet */}
      <VariantBottomSheet
        isOpen={isVariantSheetOpen}
        onClose={() => setIsVariantSheetOpen(false)}
        productName={product.name}
        productImage={product.thumbnail}
        variants={defaultVariants}
        selectedVariant={selectedVariant}
        onSelectVariant={setSelectedVariant}
        thicknesses={product.thickness || ['6 Inch', '8 Inch']}
        selectedThickness={selectedThickness}
        onSelectThickness={setSelectedThickness}
        onAddToCart={handleAddToCart}
      />

      {/* Footer */}
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

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Product Details...</div>}>
      <ProductDetailPageContent />
    </Suspense>
  );
}

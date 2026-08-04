/**
 * Chouhan Mattress - Official Wakefit-Inspired Hero Carousel Component
 * Full-bleed slide banner with support for custom uploaded artwork banners & live text slides
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon, ShieldCheckIcon } from 'lucide-react';
import homepageData from '@/data/homepage.json';

export function Hero() {
  const slides = homepageData.hero.slides;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentIndex] as any;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative w-full bg-gray-950 text-white overflow-hidden group">
      {/* Slider Container */}
      <div className="relative h-[360px] sm:h-[440px] md:h-[500px] lg:h-[560px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            {activeSlide.isCustomBanner ? (
              /* Custom Artwork Banner Rendering */
              <div className="relative w-full h-full">
                <Image
                  src={activeSlide.backgroundImage}
                  alt={activeSlide.title}
                  fill
                  priority
                  className="object-cover object-center"
                />
                {/* Hotspot Click Overlay for Primary CTA */}
                <Link
                  href={activeSlide.ctaLink || '/category/sofas'}
                  className="absolute left-[5%] top-[45%] w-[18%] h-[15%] z-10 cursor-pointer"
                  aria-label="Shop Sofas"
                />
                {/* Hotspot Click Overlay for Explore Offer Products */}
                <Link
                  href="/products"
                  className="absolute right-[6%] top-[38%] w-[18%] h-[15%] z-10 cursor-pointer"
                  aria-label="Explore Offer Products"
                />
              </div>
            ) : (
              /* Standard Live Text Slide Overlay */
              <>
                {/* Background Image */}
                <Image
                  src={activeSlide.backgroundImage}
                  alt={activeSlide.title}
                  fill
                  priority
                  className="object-cover object-center"
                />

                {/* Gradient Overlay for Text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                {/* Slide Content Overlay */}
                <div className="container mx-auto px-6 h-full flex items-center justify-between relative z-10">
                  {/* Left Column: Headline & Subtitle */}
                  <div className="max-w-xl space-y-4">
                    {activeSlide.badge && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F26522] text-white text-xs font-black rounded-full uppercase tracking-wider shadow-sm">
                        <SparklesIcon className="w-3.5 h-3.5" /> {activeSlide.badge}
                      </span>
                    )}

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                      {activeSlide.title}
                    </h1>

                    <p
                      className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed drop-shadow-sm max-w-md"
                      dangerouslySetInnerHTML={{ __html: activeSlide.subtitle }}
                    />

                    <div className="pt-2">
                      <Link
                        href={activeSlide.ctaLink || '/products'}
                        className="inline-flex items-center gap-2 px-7 py-3 bg-[#F26522] text-white font-extrabold text-sm rounded-xl hover:bg-[#d85519] transition-all shadow-md hover:scale-105"
                      >
                        {activeSlide.ctaText || 'Shop Now'} →
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Offer Box (Dynamic per slide) */}
                  <div className="hidden lg:flex flex-col items-center justify-center bg-purple-950/80 backdrop-blur-md text-white p-6 rounded-3xl border border-purple-500/30 shadow-2xl max-w-xs text-center space-y-3">
                    {activeSlide.offerCard ? (
                      <>
                        <div className="flex items-center gap-2 border-b border-purple-500/30 pb-2 w-full justify-center">
                          <ShieldCheckIcon className="w-7 h-7 text-purple-300" />
                          <div className="text-left">
                            <span className="text-xs font-black uppercase text-purple-200 block leading-none">{activeSlide.offerCard.title}</span>
                            <span className="text-[10px] font-bold text-purple-300">{activeSlide.offerCard.subtitle}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-purple-300 uppercase block">{activeSlide.offerCard.price}</span>
                        </div>

                        <Link
                          href={activeSlide.offerCard.ctaLink || "/products"}
                          className="w-full py-2.5 px-4 bg-[#F26522] text-white font-bold text-xs rounded-xl hover:bg-[#d85519] transition-colors shadow-sm"
                        >
                          {activeSlide.offerCard.ctaText}
                        </Link>
                      </>
                    ) : (
                      /* Fallback for slides without offerCard */
                      <>
                        <div className="flex items-center gap-2 border-b border-purple-500/30 pb-2 w-full justify-center">
                          <ShieldCheckIcon className="w-7 h-7 text-purple-300" />
                          <div className="text-left">
                            <span className="text-xs font-black uppercase text-purple-200 block leading-none">100 Days</span>
                            <span className="text-[10px] font-bold text-purple-300">Risk-Free Return</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-bold text-purple-300 uppercase block">Starting @</span>
                          <span className="text-3xl font-black text-white">₹6,580</span>
                        </div>

                        <Link
                          href="/products"
                          className="w-full py-2.5 px-4 bg-[#F26522] text-white font-bold text-xs rounded-xl hover:bg-[#d85519] transition-colors shadow-sm"
                        >
                          Explore Offer Products
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#F26522] transition-colors z-20 focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#F26522] transition-colors z-20 focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              'h-2.5 rounded-full transition-all cursor-pointer',
              currentIndex === idx ? 'w-8 bg-[#F26522]' : 'w-2.5 bg-white/50 hover:bg-white'
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
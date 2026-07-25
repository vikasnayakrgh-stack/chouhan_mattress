/**
 * Chouhan Mattress - Product Image Gallery Component
 * Features multi-image thumbnails, main image zoom, badges overlay, and Lightbox modal
 */

'use client';

import React, { useState } from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Maximize2Icon, XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  badges?: Array<{ text: string; variant?: string }>;
  className?: string;
}

export function ImageGallery({
  images,
  productName,
  badges = [],
  className,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const activeImage = images[selectedIndex] || images[0] || '';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className={cn('flex flex-col-reverse lg:flex-row gap-4', className)}>
      {/* Thumbnails Column */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[500px] scrollbar-thin py-1 flex-shrink-0">
        {images.map((img, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]',
                isSelected
                  ? 'border-[#F26522] shadow-sm ring-2 ring-orange-200'
                  : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${index + 1} of ${productName}`}
            >
              <OptimizedImage
                src={img}
                alt={`${productName} thumbnail ${index + 1}`}
                preset="thumbnail"
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Main Large Image Box */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 aspect-4/3 sm:aspect-Square lg:aspect-4/3 group">
        {/* Badges Overlay */}
        {badges.length > 0 && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
            {badges.map((b, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#F26522] text-white text-xs font-bold rounded-full shadow-sm"
              >
                {b.text}
              </span>
            ))}
          </div>
        )}

        {/* Lightbox Trigger Button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-xs text-gray-700 rounded-full shadow-md hover:bg-white hover:text-[#F26522] transition-colors focus-visible:outline-none"
          aria-label="Open full screen lightbox"
          title="Full Screen View"
        >
          <Maximize2Icon className="w-4 h-4" />
        </button>

        {/* Main Zoom Container */}
        <div
          className="relative w-full h-full cursor-zoom-in overflow-hidden"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
        >
          <OptimizedImage
            src={activeImage}
            alt={productName}
            preset="hero"
            priority
            className="w-full h-full object-cover transition-transform duration-200"
            style={
              isZoomed
                ? {
                    transform: 'scale(1.8)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }
                : undefined
            }
          />
        </div>
      </div>

      {/* ─── Lightbox Modal ─── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <XIcon className="w-6 h-6" />
          </button>

          {/* Prev / Next buttons */}
          <button
            onClick={() =>
              setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
            }
            className="absolute left-6 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
            }
            className="absolute right-6 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] relative flex flex-col items-center">
            <OptimizedImage
              src={activeImage}
              alt={productName}
              preset="hero"
              className="max-w-full max-h-[75vh] object-contain rounded-xl"
            />
            <div className="mt-4 text-white/80 text-sm font-medium">
              Image {selectedIndex + 1} of {images.length} — {productName}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;

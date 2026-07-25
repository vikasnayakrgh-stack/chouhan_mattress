/**
 * Chouhan Mattress - Product Specifications, Layers & Feature Tabs for PDP
 */

'use client';

import React, { useState } from 'react';
import { LayersIcon, ShieldCheckIcon, SparklesIcon, HelpCircleIcon, InfoIcon, HeartHandshakeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductTabsProps {
  description?: string;
  features?: string[];
  material?: string;
  warranty?: string;
  trial?: string;
  specifications?: Record<string, string>;
  className?: string;
}

const LAYERS_INFO = [
  { title: 'Breathable Knitted Fabric Outer Cover', desc: 'Soft-to-touch, hypoallergenic fabric cover with airflow channels for cool sleep.' },
  { title: 'Responsive Memory Foam Layer', desc: 'Conforms to your body posture, relieving pressure points on hips and shoulders.' },
  { title: '7-Zone Ergonomic Support Foam', desc: 'Targeted support for spine alignment — firm support where needed, soft cushion at joints.' },
  { title: 'High-Density Base Foam Layer', desc: 'Prevents sagging, ensuring mattress maintains shape and bounce for 10+ years.' },
];

const FAQS = [
  {
    q: 'How does the 100-Night Free Trial work?',
    a: 'Sleep on your Chouhan Mattress for up to 100 nights. If you are not completely satisfied, request a free pickup within 100 days for a 100% full refund — no questions asked.',
  },
  {
    q: 'What does the 10-Year Warranty cover?',
    a: 'Our warranty covers any manufacturing defects, sagging greater than 1 inch, foam degradation, or physical flaws under normal usage.',
  },
  {
    q: 'Does it require a specific bed frame?',
    a: 'Chouhan Mattresses work on all flat surfaces including wooden slat beds, hydraulic storage beds, box springs, and even directly on the floor.',
  },
  {
    q: 'How is the mattress delivered?',
    a: 'It arrives rolled and vacuum-compressed in a compact box. Simply unbox, place on your bed, and watch it expand to full size within 4-6 hours.',
  },
];

export function ProductTabs({
  description,
  features = [],
  material,
  warranty = '10 Years',
  trial = '100 Nights',
  specifications = {},
  className,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'layers' | 'warranty' | 'faqs'>('overview');

  return (
    <div className={cn('bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xs', className)}>
      {/* Navigation Tabs Bar */}
      <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none gap-4 md:gap-8 mb-8">
        {[
          { id: 'overview', label: 'Overview & Features', icon: SparklesIcon },
          { id: 'layers', label: 'Layer Construction', icon: LayersIcon },
          { id: 'warranty', label: 'Warranty & Trial', icon: ShieldCheckIcon },
          { id: 'faqs', label: 'Product FAQs', icon: HelpCircleIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 pb-4 text-sm md:text-base font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer focus-visible:outline-none',
                isActive
                  ? 'border-[#F26522] text-[#F26522]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {description && (
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{description}</p>
          )}

          {features.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 text-sm md:text-base mb-3">Key Highlights:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-800 border border-gray-100">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#F26522] text-xs flex items-center justify-center font-bold">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Table */}
          {Object.keys(specifications).length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 text-sm md:text-base mb-3">Technical Specifications:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs md:text-sm">
                {Object.entries(specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">{key}</span>
                    <span className="text-gray-900 font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Layers */}
      {activeTab === 'layers' && (
        <div className="space-y-6 animate-fadeIn">
          <p className="text-gray-600 text-sm">
            Handcrafted with 4 precision foam layers designed for maximum back comfort and breathability.
          </p>

          <div className="space-y-4">
            {LAYERS_INFO.map((layer, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50/40 to-amber-50/20 border border-orange-100">
                <div className="w-8 h-8 rounded-full bg-[#F26522] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm md:text-base">{layer.title}</h4>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Warranty & Trial */}
      {activeTab === 'warranty' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200">
              <div className="w-10 h-10 rounded-full bg-[#F26522] text-white flex items-center justify-center mb-3">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-base mb-1">{warranty} Full Warranty</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Covers all manufacturing defects, foam sagging & loss of resilience under normal home usage.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3">
                <HeartHandshakeIcon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-gray-900 text-base mb-1">{trial} Risk-Free Trial</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sleep on it at home. If you don't love it, we pick it up for free and issue a 100% full refund.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4 animate-fadeIn">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-900 text-sm md:text-base flex items-start gap-2">
                <span className="text-[#F26522]">Q:</span> {faq.q}
              </h4>
              <p className="text-xs md:text-sm text-gray-600 mt-2 pl-5 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductTabs;

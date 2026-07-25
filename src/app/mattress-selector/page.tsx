/**
 * Chouhan Mattress - Interactive Mattress Finder / Sleep Selector Wizard (/mattress-selector)
 * Step-by-step questionnaire recommending the ideal mattress based on sleep science
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

import {
  SparklesIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  StarIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  AwardIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import productsData from '@/data/products.json';
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

interface QuizAnswers {
  posture: string;
  weight: string;
  concern: string;
  firmness: string;
  budget: string;
}

const QUESTIONS = [
  {
    id: 'posture',
    question: 'What is your primary sleeping position?',
    subtitle: 'This helps us determine the right contouring and pressure relief required.',
    options: [
      { id: 'back', label: 'Back Sleeper', desc: 'Needs targeted lumbar & spine alignment', icon: '🛌' },
      { id: 'side', label: 'Side Sleeper', desc: 'Needs soft pressure relief for shoulders & hips', icon: '😴' },
      { id: 'stomach', label: 'Stomach Sleeper', desc: 'Needs firm support to prevent lower back sink', icon: '💤' },
      { id: 'combination', label: 'Combination Sleeper', desc: 'Shifts positions throughout the night', icon: '🔄' },
    ],
  },
  {
    id: 'weight',
    question: 'What is your body weight range?',
    subtitle: 'Weight affects how deep you sink into the foam layers.',
    options: [
      { id: 'light', label: 'Under 60 kg', desc: 'Soft to Medium firmness recommended', icon: '🪶' },
      { id: 'medium', label: '60 kg – 80 kg', desc: 'Medium-Firm balanced support recommended', icon: '⚖️' },
      { id: 'heavy', label: 'Above 80 kg', desc: 'Firm Orthopedic high-density foam recommended', icon: '💪' },
    ],
  },
  {
    id: 'concern',
    question: 'Do you have any specific sleep or health concerns?',
    subtitle: 'Select your biggest comfort priority.',
    options: [
      { id: 'backpain', label: 'Back or Neck Pain', desc: '7-Zone Orthopedic spinal alignment required', icon: '🩺' },
      { id: 'hot', label: 'Sleeping Hot / Sweating', desc: 'Open-cell cooling gel airflow foam required', icon: '❄️' },
      { id: 'partner', label: 'Partner Disturbance', desc: 'Zero motion transfer technology required', icon: '💑' },
      { id: 'none', label: 'No Specific Pain', desc: 'Just looking for luxurious hotel comfort', icon: '✨' },
    ],
  },
  {
    id: 'firmness',
    question: 'What is your preferred mattress firmness?',
    subtitle: 'From plush hotel feel to solid back support.',
    options: [
      { id: 'soft', label: 'Plush & Soft (4/10)', desc: 'Cloud-like memory foam contouring', icon: '☁️' },
      { id: 'medium-firm', label: 'Medium Firm (7/10)', desc: 'Ideal balance of comfort & orthopedic support', icon: '🌟' },
      { id: 'firm', label: 'Extra Firm (9/10)', desc: 'Solid firm back support for severe back pain', icon: '🧱' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your target budget range?',
    subtitle: 'All Chouhan Mattresses come with 100-Night Trial & 10-Year Warranty.',
    options: [
      { id: 'budget', label: 'Under ₹10,000', desc: 'Essential Orthopedic Series', icon: '🏷️' },
      { id: 'mid', label: '₹10,000 – ₹20,000', desc: 'Classic Memory Foam & Latex Series', icon: '⭐' },
      { id: 'luxury', label: 'Above ₹20,000', desc: 'Smart AI & Luxury Hotel Series', icon: '👑' },
    ],
  },
];

function MattressSelectorContent() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = QUESTIONS[currentStepIndex];

  const handleSelectOption = (value: string) => {
    const updatedAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(updatedAnswers);

    if (currentStepIndex < QUESTIONS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  // Recommendation Algorithm
  const recommendedMattress = React.useMemo(() => {
    if (answers.concern === 'backpain' || answers.weight === 'heavy') {
      return productsData[0]; // ShapeSense Orthopedic Essential
    }
    if (answers.concern === 'hot' || answers.firmness === 'soft') {
      return productsData[1]; // ShapeSense Memory Foam Classic
    }
    return productsData[0];
  }, [answers]);

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
          <Breadcrumbs items={[{ label: 'Sleep Selector Wizard', isCurrent: true }]} />

          {/* Hero Banner */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-100 text-[#F26522] text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              <SparklesIcon className="w-4 h-4" /> AI Sleep Selector Quiz
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              Find Your <span className="text-[#F26522]">Perfect Mattress</span> in 60 Seconds
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Answer 5 quick sleep posture questions to receive an instant recommendation backed by ergonomic sleep science.
            </p>
          </div>

          {/* Wizard Card Container */}
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs">
            {!isCompleted ? (
              /* Quiz Step View */
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Question {currentStepIndex + 1} of {QUESTIONS.length}</span>
                    <span className="text-[#F26522]">{Math.round(((currentStepIndex + 1) / QUESTIONS.length) * 100)}% Completed</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F26522] transition-all duration-300 rounded-full"
                      style={{ width: `${((currentStepIndex + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question & Subtitle */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {currentQ.question}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {currentQ.subtitle}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id as keyof QuizAnswers] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={cn(
                          'w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group focus-visible:outline-none cursor-pointer',
                          isSelected
                            ? 'border-[#F26522] bg-orange-50/60 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="text-2xl p-2 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                            {opt.icon}
                          </span>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                              {opt.label}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                          </div>
                        </div>

                        <ChevronRightIcon
                          className={cn(
                            'w-5 h-5 transition-transform',
                            isSelected ? 'text-[#F26522] translate-x-1' : 'text-gray-300 group-hover:translate-x-1'
                          )}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Back Button */}
                {currentStepIndex > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                      Previous Question
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Recommendation Result View */
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center p-4 bg-orange-50 rounded-2xl border border-orange-200">
                  <span className="inline-flex items-center gap-1 text-xs font-black text-green-700 bg-green-100 px-3 py-1 rounded-full mb-2">
                    ✓ 98.4% Sleep Science Match
                  </span>
                  <h2 className="text-2xl font-black text-gray-900">
                    We Found Your Ideal Mattress!
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    Based on your sleep posture, support needs, and preferences.
                  </p>
                </div>

                {/* Recommended Product Card */}
                <div className="p-6 bg-white rounded-2xl border-2 border-[#F26522] shadow-md flex flex-col sm:flex-row gap-6 items-center">
                  <div className="relative w-36 h-36 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                    <Image
                      src={recommendedMattress.thumbnail}
                      alt={recommendedMattress.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <span className="px-2.5 py-0.5 bg-[#F26522] text-white text-[10px] font-black rounded-full uppercase">
                      #1 Recommended Match
                    </span>
                    <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl">
                      {recommendedMattress.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {recommendedMattress.description}
                    </p>

                    <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-1">
                      <span className="text-2xl font-black text-gray-900">
                        ₹{recommendedMattress.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{recommendedMattress.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-green-700">
                        ({recommendedMattress.discount}% OFF)
                      </span>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/product/${recommendedMattress.id}`}
                        className="flex-1 py-3 px-5 bg-[#F26522] text-white font-black text-xs sm:text-sm rounded-xl text-center hover:bg-[#d85519] transition-colors shadow-xs"
                      >
                        View & Buy with 100-Night Trial →
                      </Link>
                      <button
                        onClick={handleReset}
                        className="py-3 px-4 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 flex items-center justify-center gap-1"
                      >
                        <RotateCcwIcon className="w-3.5 h-3.5" /> Retake Quiz
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <div>
                    <strong className="block text-gray-900 font-bold">100 Nights</strong> Risk-Free Trial
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-bold">10 Years</strong> Warranty
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-bold">Free</strong> Shipping & Pickup
                  </div>
                </div>
              </div>
            )}
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

export default function MattressSelectorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Sleep Selector...</div>}>
      <MattressSelectorContent />
    </Suspense>
  );
}

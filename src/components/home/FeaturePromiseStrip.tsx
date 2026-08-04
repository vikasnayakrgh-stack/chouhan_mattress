/**
 * Chouhan Mattress - Wakefit Dual Feature Promise & Offer Strip Component
 * Displays Sale Countdown & Bank Offers on the Left, and "Why Chouhan Mattress?" Trust Features on the Right
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  SmileIcon,
  TruckIcon,
  WrenchIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  ClockIcon,
} from 'lucide-react';

export function FeaturePromiseStrip() {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 5,
    minutes: 51,
    seconds: 1,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        if (hours < 0) {
          hours = 23;
          days -= 1;
        }
        if (days < 0) return prev;
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#FFF8F0] py-6 px-4 md:px-8 border-b border-orange-100">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Card: Home Sweet Home Sale & Countdown Timer (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-orange-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Sale Logo & Countdown */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B0764] to-purple-900 text-white flex flex-col items-center justify-center text-center p-2 shadow-sm flex-shrink-0">
              <span className="text-[9px] font-black text-[#F26522] uppercase tracking-wider">CHOUHAN</span>
              <span className="text-xs font-extrabold leading-tight">HOME SALE</span>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-700 block mb-1">Sale Ends In:</span>
              <div className="flex items-center gap-1.5 font-mono font-black text-lg text-[#F26522]">
                <span className="bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">{String(timeLeft.days).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-0.5 px-0.5">
                <span>Days</span><span>Hrs</span><span>Mins</span><span>Sec</span>
              </div>
            </div>
          </div>

          <div className="h-10 w-px bg-gray-200 hidden md:block" />

          {/* Bank Offer Badge */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1 overflow-hidden">
              {['ICICI', 'AXIS', 'HDFC', 'KOTAK'].map((bank, i) => (
                <span
                  key={i}
                  className="inline-block w-7 h-7 rounded-full bg-gray-100 border border-white text-[8px] font-black text-purple-900 flex items-center justify-center"
                >
                  {bank}
                </span>
              ))}
            </div>
            <div>
              <span className="text-xs font-bold text-gray-900 block">Flat 10% OFF</span>
              <a href="/offers" className="text-xs font-bold text-[#F26522] hover:underline inline-flex items-center gap-0.5">
                Bank Offers &gt;&gt;
              </a>
            </div>
          </div>
        </div>

        {/* Right Card: Why Chouhan Mattress? (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-purple-200/80 shadow-sm flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <span className="text-xs font-black text-gray-400 block uppercase">Why</span>
            <h3 className="text-base font-black text-[#3B0764] leading-none">Chouhan?</h3>
          </div>

          <div className="grid grid-cols-4 gap-3 flex-1 text-center text-xs">
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-[#3B0764] flex items-center justify-center">
                <SmileIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700 leading-tight">50,000+ Customers</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-[#3B0764] flex items-center justify-center">
                <TruckIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700 leading-tight">Free Shipping</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-[#3B0764] flex items-center justify-center">
                <WrenchIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700 leading-tight">Free Installation</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-[#3B0764] flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-gray-700 leading-tight">Best Warranty</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default FeaturePromiseStrip;

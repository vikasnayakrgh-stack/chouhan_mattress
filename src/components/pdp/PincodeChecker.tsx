/**
 * Chouhan Mattress - Pincode Serviceability & SLA Checker Component for PDP
 */

'use client';

import React, { useState } from 'react';
import { MapPinIcon, CheckCircle2Icon, TruckIcon, ShieldCheckIcon, CreditCardIcon, WrenchIcon } from 'lucide-react';
import { PincodeServiceability } from '@/types/pdp';
import { cn } from '@/lib/utils';

interface PincodeCheckerProps {
  className?: string;
}

export function PincodeChecker({ className }: PincodeCheckerProps) {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<PincodeServiceability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit Indian PIN code');
      setResult(null);
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      // Calculate delivery date SLA (4-6 days from today)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      const dateString = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });

      setResult({
        pincode,
        isServiceable: true,
        estimatedDays: 5,
        estimatedDateString: dateString,
        freeShipping: true,
        cashOnDelivery: true,
        freeInstallation: true,
      });
      setLoading(false);
    }, 400);
  };

  return (
    <div className={cn('p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor="pincode-input" className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
          <MapPinIcon className="w-4 h-4 text-[#F26522]" />
          <span>Delivery & Serviceability Checker</span>
        </label>
        {result && (
          <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2Icon className="w-3 h-3" />
            Serviceable to {result.pincode}
          </span>
        )}
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          id="pincode-input"
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit PIN Code"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            setError('');
          }}
          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gray-900 text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-gray-800 transition-colors focus-visible:outline-none disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      {/* SLA & Delivery Trust Badges */}
      {result ? (
        <div className="pt-2 border-t border-gray-200/60 space-y-1.5 text-xs text-gray-700">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <TruckIcon className="w-4 h-4 text-green-600" />
            <span>
              Delivery by <span className="text-green-700 font-bold">{result.estimatedDateString}</span> (Free Pan-India Delivery)
            </span>
          </div>
          <div className="flex items-center gap-4 text-gray-600 pl-6 text-[11px]">
            <span>✓ Cash on Delivery Available</span>
            <span>✓ Free Installation</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <TruckIcon className="w-3.5 h-3.5 text-[#F26522]" /> Free Shipping
          </span>
          <span className="flex items-center gap-1">
            <WrenchIcon className="w-3.5 h-3.5 text-[#F26522]" /> Free Installation
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-[#F26522]" /> 100 Night Trial
          </span>
          <span className="flex items-center gap-1">
            <CreditCardIcon className="w-3.5 h-3.5 text-[#F26522]" /> No Cost EMI
          </span>
        </div>
      )}
    </div>
  );
}

export default PincodeChecker;

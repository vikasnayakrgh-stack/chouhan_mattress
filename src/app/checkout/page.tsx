/**
 * Chouhan Mattress - Multi-step Checkout Page (/checkout)
 * Step 1: Address Management | Step 2: Shipping Options | Step 3: Payment Gateways (UPI, Cards, NetBanking, EMI, COD)
 */

'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  CheckCircle2Icon,
  MapPinIcon,
  TruckIcon,
  CreditCardIcon,
  LockIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  BuildingIcon,
  SmartphoneIcon,
  CheckIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  pincode: string;
  houseNo: string;
  street: string;
  city: string;
  state: string;
  addressType: 'Home' | 'Work';
}

function CheckoutPageContent() {
  const router = useRouter();
  const { items, subtotal, couponDiscount, grandTotal, clearCart } = useCart();

  // Active step state: 1 = Address, 2 = Shipping, 3 = Payment
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Address Form State
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: '',
    phone: '',
    pincode: '',
    houseNo: '',
    street: '',
    city: '',
    state: '',
    addressType: 'Home',
  });

  // Step 2: Shipping Option
  const [selectedShipping, setSelectedShipping] = useState<'standard' | 'express'>('standard');

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'emi' | 'cod'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = selectedShipping === 'express' ? 199 : 0;
  const finalPayable = grandTotal + shippingCost;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.pincode || !address.houseNo) {
      alert('Please fill in all required shipping address fields');
      return;
    }
    setCurrentStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantSize: item.size || (typeof item.variant === 'string' ? item.variant : undefined),
            quantity: item.quantity,
          })),
          shippingAddress: address,
          shippingMethod: selectedShipping,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.error || 'Failed to create authoritative server order');
        setIsProcessing(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${result.order.orderId}`);
    } catch (err: any) {
      alert('Order placement network error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ─── Checkout Simple Header ─── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Chouhan <span className="text-[#F26522]">Mattress</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <LockIcon className="w-4 h-4 text-green-600" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* ─── Checkout Main Body ─── */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Step Wizard Progress Header */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#F26522] -translate-y-1/2 transition-all duration-300 -z-0"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
            />

            {/* Step 1 Indicator */}
            <div
              onClick={() => setCurrentStep(1)}
              className={cn(
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer',
                currentStep >= 1
                  ? 'bg-[#F26522] text-white shadow-md'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {currentStep > 1 ? <CheckIcon className="w-5 h-5 stroke-[3]" /> : '1'}
            </div>

            {/* Step 2 Indicator */}
            <div
              onClick={() => currentStep > 1 && setCurrentStep(2)}
              className={cn(
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer',
                currentStep >= 2
                  ? 'bg-[#F26522] text-white shadow-md'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {currentStep > 2 ? <CheckIcon className="w-5 h-5 stroke-[3]" /> : '2'}
            </div>

            {/* Step 3 Indicator */}
            <div
              className={cn(
                'relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all',
                currentStep === 3
                  ? 'bg-[#F26522] text-white shadow-md'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              3
            </div>
          </div>

          <div className="flex justify-between text-xs font-bold text-gray-700 mt-2">
            <span>Shipping Address</span>
            <span className="text-center">Delivery SLA</span>
            <span className="text-right">Payment</span>
          </div>
        </div>

        {/* ─── Main Checkout Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Steps (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Address Management */}
            {currentStep === 1 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-[#F26522]" />
                    <span>Shipping Address</span>
                  </h2>
                  <span className="text-xs text-gray-400">Step 1 of 3</span>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Flat / House No / Building Name *</label>
                    <input
                      type="text"
                      required
                      value={address.houseNo}
                      onChange={(e) => setAddress({ ...address, houseNo: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Street Address & Landmark *</label>
                    <input
                      type="text"
                      required
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">Address Type</label>
                    <div className="flex gap-4">
                      {(['Home', 'Work'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddress({ ...address, addressType: type })}
                          className={cn(
                            'px-5 py-2 text-xs font-bold rounded-xl border transition-all',
                            address.addressType === type
                              ? 'bg-[#F26522] text-white border-[#F26522]'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                          )}
                        >
                          {type === 'Home' ? '🏠 Home (All day delivery)' : '🏢 Work (10 AM - 6 PM)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#F26522] text-white font-black text-sm rounded-2xl hover:bg-[#d85519] transition-colors flex items-center justify-center gap-2 shadow-sm mt-6"
                  >
                    <span>Save & Continue to Delivery Options</span>
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: Delivery Option & SLA */}
            {currentStep === 2 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TruckIcon className="w-5 h-5 text-[#F26522]" />
                    <span>Select Delivery Option</span>
                  </h2>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-[#F26522] hover:underline"
                  >
                    Edit Address
                  </button>
                </div>

                {/* Selected Address Summary */}
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 text-xs text-gray-700">
                  <span className="font-bold text-gray-900 block">{address.fullName} ({address.phone})</span>
                  <p className="mt-0.5">{address.houseNo}, {address.street}, {address.city}, {address.state} - {address.pincode}</p>
                </div>

                <div className="space-y-3">
                  {/* Standard Delivery */}
                  <label
                    onClick={() => setSelectedShipping('standard')}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all',
                      selectedShipping === 'standard'
                        ? 'border-[#F26522] bg-orange-50/50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShipping === 'standard'}
                        onChange={() => setSelectedShipping('standard')}
                        className="text-[#F26522] focus:ring-[#F26522]"
                      />
                      <div>
                        <span className="font-bold text-gray-900 text-sm block">Standard Free Delivery</span>
                        <span className="text-xs text-gray-500">Delivered within 4-5 business days • Free Assembly</span>
                      </div>
                    </div>
                    <span className="font-bold text-green-700 text-sm">FREE</span>
                  </label>

                  {/* Express Priority Delivery */}
                  <label
                    onClick={() => setSelectedShipping('express')}
                    className={cn(
                      'flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all',
                      selectedShipping === 'express'
                        ? 'border-[#F26522] bg-orange-50/50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShipping === 'express'}
                        onChange={() => setSelectedShipping('express')}
                        className="text-[#F26522] focus:ring-[#F26522]"
                      />
                      <div>
                        <span className="font-bold text-gray-900 text-sm block flex items-center gap-1.5">
                          <span>Express Priority Delivery</span>
                          <span className="text-[10px] bg-orange-100 text-[#F26522] px-1.5 py-0.5 rounded font-black">FAST</span>
                        </span>
                        <span className="text-xs text-gray-500">Delivered within 48 hours • Scheduled Slot</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">+₹199</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-3.5 bg-[#F26522] text-white font-black text-sm rounded-xl hover:bg-[#d85519] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Proceed to Payment</span>
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Selector */}
            {currentStep === 3 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CreditCardIcon className="w-5 h-5 text-[#F26522]" />
                    <span>Payment Method</span>
                  </h2>
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                    🔒 256-Bit Encrypted
                  </span>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'upi', label: 'UPI (Instant)', icon: '📱' },
                    { id: 'card', label: 'Card', icon: '💳' },
                    { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
                    { id: 'emi', label: 'No Cost EMI', icon: '⚡' },
                    { id: 'cod', label: 'COD', icon: '💵' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={cn(
                        'p-3 text-center rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 focus-visible:outline-none',
                        paymentMethod === m.id
                          ? 'border-[#F26522] bg-orange-50/60 font-bold text-gray-900'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      )}
                    >
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-xs font-bold leading-tight">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Payment Sub-Forms */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-4">
                  {/* UPI Sub-form */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-gray-700 block">Select Instant UPI Option:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['gpay', 'phonepe', 'paytm', 'bhim'].map((app) => (
                          <button
                            key={app}
                            onClick={() => setSelectedUpiApp(app)}
                            className={cn(
                              'p-2.5 rounded-xl border text-xs font-bold uppercase transition-all',
                              selectedUpiApp === app
                                ? 'bg-white border-[#F26522] text-[#F26522] shadow-xs'
                                : 'bg-gray-100 border-transparent text-gray-600'
                            )}
                          >
                            {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : app === 'paytm' ? 'Paytm' : 'BHIM UPI'}
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Or Enter UPI ID / VPA:</label>
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Card Sub-form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4532 •••• •••• 8901"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="08/28"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F26522]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* COD Sub-form */}
                  {paymentMethod === 'cod' && (
                    <div className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 text-xs">
                      <span className="font-bold block">Cash on Delivery (COD)</span>
                      <span>Pay in cash or via UPI QR code when your Chouhan Mattress is delivered to your doorstep.</span>
                    </div>
                  )}

                  {/* Netbanking & EMI fallback notices */}
                  {(paymentMethod === 'netbanking' || paymentMethod === 'emi') && (
                    <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-xs">
                      <span className="font-bold block">No Cost EMI & Net Banking Partner</span>
                      <span>You will be securely redirected to your bank portal after clicking Place Order.</span>
                    </div>
                  )}
                </div>

                {/* Final Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#F26522] text-white font-black text-base rounded-2xl hover:bg-[#d85519] transition-colors flex items-center justify-center gap-2 shadow-lg focus-visible:outline-none disabled:opacity-60 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <LockIcon className="w-5 h-5" />
                      <span>Place Order & Pay ₹{finalPayable.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Sidebar (5 Columns) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>Order Items ({items.length})</span>
                <Link href="/cart" className="text-xs text-[#F26522] hover:underline font-semibold">
                  Edit Cart
                </Link>
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                      <p className="text-gray-500">{item.size || 'Standard'} (x{item.quantity})</p>
                    </div>
                    <span className="font-extrabold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping & Delivery</span>
                  <span className="font-bold text-green-700">
                    {shippingCost === 0 ? 'FREE' : `+₹${shippingCost}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                  <span>Total Amount:</span>
                  <span className="text-[#F26522]">₹{finalPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Risk-free Guarantee Box */}
            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200 text-xs text-gray-700 space-y-2">
              <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-[#F26522]" /> Chouhan Mattress Assurance
              </span>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Includes 100-Night Risk-Free Trial, 10-Year Factory Warranty, and Free Pan-India Doorstep Delivery.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading Checkout...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}

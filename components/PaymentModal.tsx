import React, { useState, useEffect, useRef } from 'react';
import { PAYPAL_CLIENT_ID } from '../config';

// Make TypeScript aware of the PayPal script on the window object
declare global {
  interface Window {
    paypal: any;
  }
}

interface PaymentModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

// A wrapper component to encapsulate the PayPal button rendering logic
const PayPalButtonWrapper: React.FC<{ onSuccess: () => void; onError: (err: any) => void }> = ({ onSuccess, onError }) => {
    const paypalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // The SDK should be ready when this component renders
        if (window.paypal && paypalRef.current) {
            // Clear the container to prevent duplicate buttons on re-renders
            paypalRef.current.innerHTML = ''; 
            
            try {
                window.paypal.Buttons({
                    // Style the button
                    style: {
                        layout: 'vertical',
                        color: 'blue',
                        shape: 'rect',
                        label: 'paypal',
                    },
                    // Set up the transaction
                    createOrder: (data: any, actions: any) => {
                        return actions.order.create({
                            purchase_units: [{
                                description: 'AI UI Mockup Generator - Pro Plan',
                                amount: {
                                    currency_code: 'USD',
                                    value: '29.00' // The price from the pricing page
                                }
                            }]
                        });
                    },
                    // Finalize the transaction
                    onApprove: async (data: any, actions: any) => {
                        // This function captures the funds from the transaction.
                        // A real app would send the orderID (data.orderID) to a backend for verification.
                        await actions.order.capture();
                        onSuccess();
                    },
                    // Handle errors
                    onError: (err: any) => {
                        onError(err);
                    },
                }).render(paypalRef.current);
            } catch (error) {
                onError(error);
            }
        } else {
            onError(new Error("PayPal SDK is not available."));
        }
    }, [onSuccess, onError]);

    return <div ref={paypalRef} />;
};


export const PaymentModal: React.FC<PaymentModalProps> = ({ onSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(!!window.paypal);

  // Effect to dynamically load the PayPal SDK script
  useEffect(() => {
    if (paymentMethod === 'paypal' && !isSdkReady && !document.getElementById('paypal-sdk-script')) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk-script';
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
      script.onload = () => {
        setIsSdkReady(true);
      };
      script.onerror = () => {
        setPaymentError("Failed to load PayPal script. Please verify your Client ID in config.ts or check your internet connection.");
      };
      document.body.appendChild(script);
    }
  }, [paymentMethod, isSdkReady]);

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);
    // Simulate API call to payment provider
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000); // 2-second delay to simulate processing
  };

  const handlePayPalError = (err: any) => {
    console.error("PayPal Error:", err);
    setPaymentError("An error occurred with PayPal. Please try again or use a different payment method.");
  };

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl shadow-indigo-900/30 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Upgrade to Pro</h2>
                    <p className="text-gray-400">Unlock all features and unlimited downloads.</p>
                </div>
                 <button 
                    onClick={onClose} 
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="Close payment modal"
                    disabled={isProcessing}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            {/* Payment Method Toggle */}
            <div className="mb-6 grid grid-cols-2 gap-2 bg-gray-900/50 p-1 rounded-lg">
                <button
                    onClick={() => { setPaymentMethod('card'); setPaymentError(null); }}
                    className={`w-full text-center text-sm font-semibold py-2 rounded-md transition-colors ${paymentMethod === 'card' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
                >
                    Credit Card
                </button>
                <button
                    onClick={() => { setPaymentMethod('paypal'); setPaymentError(null); }}
                    className={`w-full text-center text-sm font-semibold py-2 rounded-md transition-colors ${paymentMethod === 'paypal' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
                >
                    PayPal
                </button>
            </div>

            {paymentError && (
              <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm text-center">
                {paymentError}
              </div>
            )}
          
            {paymentMethod === 'card' && (
                <form onSubmit={handleCardSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="card-name" className="block text-sm font-medium text-gray-300 mb-1">
                        Cardholder Name
                        </label>
                        <input
                        id="card-name"
                        type="text"
                        placeholder="John Doe"
                        required
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-300 mb-1">
                        Card Number
                        </label>
                        <input
                        id="card-number"
                        type="text"
                        placeholder="•••• •••• •••• ••••"
                        required
                        pattern="[\d\s]{16,22}"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-300 mb-1">
                            Expiry Date
                            </label>
                            <input
                            id="expiry-date"
                            type="text"
                            placeholder="MM / YY"
                            required
                            pattern="\d\d\s/\s\d\d"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-1">
                            CVC
                            </label>
                            <input
                            id="cvc"
                            type="text"
                            placeholder="123"
                            required
                            pattern="\d{3,4}"
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center"
                        >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Pay $29 and Upgrade'
                        )}
                        </button>
                    </div>
                </form>
            )}

            {paymentMethod === 'paypal' && (
              <div className="text-center pt-2">
                {!isSdkReady && !paymentError && (
                    <div className="flex justify-center items-center py-10">
                        <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-3 text-gray-400">Loading PayPal...</span>
                    </div>
                )}
                {isSdkReady && !paymentError && (
                    <>
                        <p className="text-gray-400 mb-4 text-sm">
                            You will be redirected to PayPal to complete your purchase securely.
                        </p>
                        <PayPalButtonWrapper onSuccess={onSuccess} onError={handlePayPalError} />
                    </>
                )}
              </div>
            )}
            <p className="text-center text-xs text-gray-500 mt-6">
                For credit cards, this is a simulated payment. For PayPal, it uses a sandbox environment. No real money will be charged.
            </p>
        </div>
      </div>
    </div>
  );
};
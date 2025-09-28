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
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(!!window.paypal);

  // Effect to dynamically load the PayPal SDK script
  useEffect(() => {
    if (!isSdkReady && !document.getElementById('paypal-sdk-script')) {
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
  }, [isSdkReady]);


  const handlePayPalError = (err: any) => {
    console.error("PayPal Error:", err);
    setPaymentError("An error occurred with PayPal. Please try again later.");
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
                    <p className="text-gray-400">Complete your payment with PayPal.</p>
                </div>
                 <button 
                    onClick={onClose} 
                    className="text-gray-500 hover:text-white transition-colors"
                    aria-label="Close payment modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            {paymentError && (
              <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm text-center">
                {paymentError}
              </div>
            )}
          
            <div className="text-center pt-2">
                {!isSdkReady && !paymentError && (
                    <div className="flex justify-center items-center py-10">
                        <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-3 text-gray-400">Loading Secure Payment...</span>
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
            <p className="text-center text-xs text-gray-500 mt-6">
                Payments are processed via PayPal's secure sandbox environment. No real money will be charged.
            </p>
        </div>
      </div>
    </div>
  );
};
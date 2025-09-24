import React, { useState } from 'react';

interface PaymentModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const PayPalIcon = () => (
    <svg 
        width="75" 
        height="23" 
        viewBox="0 0 75 23" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block h-5 w-auto"
        aria-label="PayPal Logo"
    >
        <path d="M6.21306 22.8472H11.3323L13.3155 8.87722H8.19628L6.21306 22.8472Z" fill="#253B80"/>
        <path d="M23.754 8.87722H18.6347L16.6515 22.8472H21.7708C25.1388 22.8472 27.464 20.8992 28.4412 17.2672C29.4184 13.6352 27.6916 10.5952 23.754 8.87722Z" fill="#253B80"/>
        <path d="M41.082 8.87722H35.9628L32.9348 27.3592L35.394 27.3312L36.3712 21.3552L38.204 9.87122L41.082 8.87722Z" fill="#253B80"/>
        <path d="M38.8687 15.0188C38.3039 15.326 37.6839 15.4868 36.9995 15.4868H35.3363L35.9395 11.6628L36.1635 10.2308L36.1915 10.2028C36.7303 10.3468 37.2691 10.6028 37.6687 10.9708C38.0683 11.3388 38.4195 11.8268 38.6595 12.4348C38.8995 13.0428 39.0235 13.7388 39.0235 14.5268C39.0235 14.6988 38.9743 14.8708 38.8687 15.0188Z" fill="#179BD7"/>
        <path d="M47.1687 15.9312C46.5495 15.9312 45.9603 16.1032 45.4051 16.4472C44.8499 16.7912 44.4035 17.2792 44.0723 17.9192C43.7411 18.5592 43.5755 19.2872 43.5755 20.0912C43.5755 21.9312 44.2835 23.3232 45.6995 24.1632C47.1155 25.0032 48.8699 25.3632 50.8547 25.3632C53.4419 25.3632 55.4867 24.9272 56.9219 25.0112L56.4179 21.7872C55.4099 22.3872 54.2387 22.6872 52.8947 22.6872C51.8227 22.6872 51.0091 22.4592 50.4539 21.9912C49.8987 21.5232 49.6211 20.8152 49.6211 19.8512C49.6211 19.2112 49.7931 18.6672 50.1371 18.2232C50.4811 17.7792 50.9691 17.4432 51.6035 17.2272L52.3115 16.9392C50.9675 16.4512 49.3379 16.2112 47.1687 15.2232V15.9312Z" fill="#179BD7"/>
        <path d="M66.4967 15.9312C65.8775 15.9312 65.2883 16.1032 64.7331 16.4472C64.1779 16.7912 63.7315 17.2792 63.3907 17.9192C63.0787 18.5592 62.9131 19.2872 62.9131 20.0912C62.9131 21.9312 63.6211 23.3232 65.0371 24.1632C66.4531 25.0032 68.2075 25.3632 70.1923 25.3632C72.7795 25.3632 74.8243 24.9272 76.2595 25.0112L75.7555 21.7872C74.7475 22.3872 73.5763 22.6872 72.2323 22.6872C71.1603 22.6872 70.3467 22.4592 69.7915 21.9912C69.2363 21.5232 68.9587 20.8152 68.9587 19.8512C68.9587 19.2112 69.1307 18.6672 69.4747 18.2232C69.8187 17.7792 70.3067 17.4432 70.9411 17.2272L71.6491 16.9392C70.3051 16.4512 68.6755 16.2112 66.4967 15.2232V15.9312Z" fill="#179BD7"/>
    </svg>
);


export const PaymentModal: React.FC<PaymentModalProps> = ({ onSuccess, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call to payment provider
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000); // 2-second delay to simulate processing
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
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 bg-gray-900/50 p-1 rounded-lg">
                <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full text-center text-sm font-semibold py-2 rounded-md transition-colors ${paymentMethod === 'card' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
                >
                    Credit Card
                </button>
                 <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`w-full text-center text-sm font-semibold py-2 rounded-md transition-colors ${paymentMethod === 'paypal' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'}`}
                >
                    PayPal
                </button>
            </div>
          
            {paymentMethod === 'card' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
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
                <div className="text-center pt-4">
                    <p className="text-gray-400 mb-4">You will be redirected to PayPal to complete your purchase securely.</p>
                     <button
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing}
                        className="w-full bg-[#0070BA] text-white font-semibold py-3 px-8 rounded-md hover:bg-[#005ea6] disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center gap-2"
                    >
                    {isProcessing ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Redirecting...
                        </>
                    ) : (
                       <>
                         Pay with <PayPalIcon />
                       </>
                    )}
                    </button>
                </div>
            )}
            <p className="text-center text-xs text-gray-500 mt-6">
                This is a simulated payment. No real card will be charged.
            </p>
        </div>
      </div>
    </div>
  );
};
import React from 'react';

export const ConfigurationError: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800/50 p-8 rounded-xl border border-red-500/50 shadow-2xl shadow-red-900/30">
        <div className="flex items-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
             <h1 className="text-2xl font-bold text-red-300">Configuration Required</h1>
             <p className="text-red-400">Your application needs API keys to run.</p>
          </div>
        </div>

        <p className="text-gray-300 mb-6">
          This app requires API keys for Google Gemini, Firebase, and PayPal. You need to add them to the <code className="bg-gray-700 text-yellow-300 px-1.5 py-1 rounded-md text-sm font-mono">config.ts</code> file in your project's source code.
        </p>

        <div className="space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg text-indigo-300 mb-2">1. Get Google Gemini API Key</h2>
                <p className="text-sm text-gray-400 mb-3">This key allows the app to generate images.</p>
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition duration-300 text-sm"
                >
                    Go to Google AI Studio
                </a>
            </div>
             <div className="bg-gray-900/50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg text-indigo-300 mb-2">2. Get Firebase Configuration</h2>
                <p className="text-sm text-gray-400 mb-3">This is needed for user login and database features.</p>
                <a 
                    href="https://console.firebase.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition duration-300 text-sm"
                >
                    Go to Firebase Console
                </a>
            </div>
             <div className="bg-gray-900/50 p-4 rounded-lg">
                <h2 className="font-semibold text-lg text-indigo-300 mb-2">3. Get PayPal Client ID</h2>
                <p className="text-sm text-gray-400 mb-3">This key is required to process payments for the Pro plan.</p>
                <a 
                    href="https://developer.paypal.com/developer/applications/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition duration-300 text-sm"
                >
                    Go to PayPal Developer Dashboard
                </a>
            </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
            <p>Once you have your keys, paste them into the <code className="bg-gray-700 text-yellow-300 px-1 py-0.5 rounded-md font-mono">config.ts</code> file, save your changes, and the application will load.</p>
        </div>
      </div>
    </div>
  );
};
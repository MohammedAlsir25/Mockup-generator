import React from 'react';

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const Feature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start">
    <CheckIcon />
    <span>{children}</span>
  </li>
);

interface PricingPageProps {
  onUpgrade: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onUpgrade }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Choose The Right Plan For You
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-400">
          Start for free and scale up as you grow. Our Pro plan unlocks powerful AI tools to supercharge your creative workflow.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Free Plan */}
        <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 flex flex-col h-full">
          <h3 className="text-2xl font-bold mb-2">Free</h3>
          <p className="text-gray-400 mb-6">For individuals and hobby projects.</p>
          <p className="text-4xl font-bold mb-6">$0 <span className="text-lg font-medium text-gray-400">/ month</span></p>
          <ul className="space-y-4 mb-8 text-gray-300">
            <Feature>Unlimited Generations</Feature>
            <Feature>3 Free Mockup Downloads per day</Feature>
            <Feature>Access to all mockup styles</Feature>
            <Feature>High-resolution PNG downloads</Feature>
          </ul>
          <button disabled className="mt-auto w-full bg-gray-600 text-white font-semibold py-3 px-8 rounded-md cursor-default">
            Your Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-indigo-900/30 p-8 rounded-xl border-2 border-indigo-500 flex flex-col h-full shadow-2xl shadow-indigo-900/50">
           <div className="relative">
             <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
             <span className="absolute top-0 right-0 -mt-2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">BETA</span>
           </div>
          <p className="text-indigo-300 mb-6">For professionals, freelancers, and teams.</p>
          <p className="text-4xl font-bold text-white mb-6">$29 <span className="text-lg font-medium text-indigo-300">/ month</span></p>
          <ul className="space-y-4 mb-8 text-indigo-200">
            <Feature>Unlimited Mockup Downloads</Feature>
            <Feature><span className="font-bold">AI Copywriter:</span> Rewrite product descriptions, CTAs, and more.</Feature>
            <Feature><span className="font-bold">AI Image Generator:</span> Create custom banners and visuals.</Feature>
            <Feature><span className="font-bold">Team Collaboration:</span> Invite members and edit together.</Feature>
            <Feature>Publishing & Hosting (Coming Soon)</Feature>
          </ul>
          <button 
            onClick={onUpgrade}
            className="mt-auto w-full bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-indigo-500 transition duration-300 transform hover:scale-105">
            Go Pro
          </button>
        </div>
      </div>
    </div>
  );
};

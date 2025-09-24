import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center py-10 md:py-16">
      <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
        Turn Your Screenshots Into Professional Mockups.
      </h2>
      <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400">
        Our AI analyzes your website's screenshots and generates five unique, professional showcase images. See your site reimagined in stunning new ways.
      </p>
    </div>
  );
};
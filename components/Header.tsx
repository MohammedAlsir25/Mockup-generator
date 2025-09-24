import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold tracking-tight">
          AI UI Mockup <span className="text-indigo-400">Generator</span>
        </h1>
      </div>
    </header>
  );
};
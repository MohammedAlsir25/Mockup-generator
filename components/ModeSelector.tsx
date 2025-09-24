import React from 'react';

interface ModeSelectorProps {
  onSelectMode: (mode: 'url' | 'screenshots') => void;
}

// FIX: Replaced JSX.Element with React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
const ModeCard: React.FC<{ title: string; description: string; onClick: () => void; icon: React.ReactNode; }> = ({ title, description, onClick, icon }) => (
  <div
    onClick={onClick}
    className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 hover:bg-gray-800 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
  >
    <div className="text-indigo-400 mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="max-w-2xl mx-auto mt-10 grid md:grid-cols-2 gap-6">
      <ModeCard
        title="URL Redesign"
        description="Provide a URL and screenshots to get five unique, professional showcase mockups of your site."
        onClick={() => onSelectMode('url')}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        }
      />
      <ModeCard
        title="Mockup from Screenshots"
        description="Upload multiple screenshots to generate five distinct, high-quality promotional images."
        onClick={() => onSelectMode('screenshots')}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />
    </div>
  );
};
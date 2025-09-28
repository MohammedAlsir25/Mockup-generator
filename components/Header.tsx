import React from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
  user: { email: string; plan: 'free' | 'pro'; downloadCount: number } | null;
  onNavigate: (view: 'generator' | 'pricing' | 'login' | 'signup' | 'history') => void;
  onLogout: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isAuthenticated, user, onNavigate, onLogout, onGoHome }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={onGoHome} className="text-2xl font-bold tracking-tight">
          AI UI Mockup <span className="text-indigo-400">Generator</span>
        </button>
        <nav className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('pricing')} 
            className="font-medium text-gray-300 hover:text-indigo-400 transition-colors duration-200"
          >
            Pricing
          </button>
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
               <button 
                onClick={() => onNavigate('history')} 
                className="font-medium text-gray-300 hover:text-indigo-400 transition-colors duration-200"
              >
                History
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400 hidden sm:inline">{user.email}</span>
                {user.plan === 'pro' ? (
                  <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">PRO</span>
                ) : (
                  <span className="bg-gray-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">FREE</span>
                )}
              </div>
              <button 
                onClick={onLogout}
                className="font-medium text-gray-300 hover:text-indigo-400 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onNavigate('login')}
                className="font-medium text-gray-300 hover:text-indigo-400 transition-colors duration-200"
              >
                Login
              </button>
              <button 
                onClick={() => onNavigate('signup')}
                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition duration-300"
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

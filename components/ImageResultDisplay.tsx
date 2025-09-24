import React from 'react';

interface ImageResultDisplayProps {
  images: string[];
  isAuthenticated: boolean;
  user: { plan: 'free' | 'pro'; downloadCount: number } | null;
  onNavigate: (view: 'signup' | 'pricing') => void;
  onDownloadSuccess: () => void;
}

export const ImageResultDisplay: React.FC<ImageResultDisplayProps> = ({ images, isAuthenticated, user, onNavigate, onDownloadSuccess }) => {
  const handleDownload = (imageBase64: string, index: number) => {
    const isPro = user?.plan === 'pro';
    const canDownloadFree = user?.plan === 'free' && user.downloadCount < 1;

    if (isPro || canDownloadFree) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${imageBase64}`;
      const fileName = images.length > 1 ? `ai-mockup-${index + 1}.png` : `ai-redesign-showcase.png`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onDownloadSuccess();
    } else {
      // User is on free plan and has used their download
      onNavigate('pricing');
    }
  };
  
  const getButtonText = (index: number) => {
    const isPro = user?.plan === 'pro';
    const canDownloadFree = user?.plan === 'free' && user.downloadCount < 1;
    
    if (isPro) return `Download Mockup ${index + 1}`;
    if (canDownloadFree) return `Download Your Free Mockup`;
    return 'Upgrade to Download';
  };

  return (
    <div className="max-w-6xl mx-auto relative">
      {!isAuthenticated && (
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl z-10 flex flex-col items-center justify-center rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Unlock Your Results!</h3>
            <p className="text-gray-300 mb-6">Sign up to view and download your first mockup for free.</p>
            <button
                onClick={() => onNavigate('signup')}
                className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-indigo-500 transition duration-300 transform hover:scale-105"
            >
                Sign Up to Continue
            </button>
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${!isAuthenticated ? 'blur-lg pointer-events-none' : ''}`}>
        {images.map((image, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden group transition-all duration-300 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-900/50 flex flex-col">
            <div className="p-2 bg-gray-900">
              <img
                src={`data:image/png;base64,${image}`}
                alt={`AI-generated design ${index + 1}`}
                className="w-full h-auto object-contain rounded-md"
              />
            </div>
            <div className="p-4 mt-auto">
              <button
                onClick={() => handleDownload(image, index)}
                disabled={!isAuthenticated}
                className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>{isAuthenticated ? getButtonText(index) : 'Download'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

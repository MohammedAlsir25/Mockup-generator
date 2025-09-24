import React from 'react';

interface ImageResultDisplayProps {
  images: string[];
}

export const ImageResultDisplay: React.FC<ImageResultDisplayProps> = ({ images }) => {
  const handleDownload = (imageBase64: string, index: number) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageBase64}`;
    const fileName = images.length > 1 ? `ai-mockup-${index + 1}.png` : `ai-redesign-showcase.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-500 transition duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>{images.length > 1 ? `Download Mockup ${index + 1}` : 'Download Showcase'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

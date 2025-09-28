import React from 'react';

interface HistoryItem {
  id: string;
  imageData: string;
  downloadedAt: string;
}

interface HistoryPageProps {
  history: HistoryItem[];
  onGoHome: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onGoHome }) => {

  const handleDownload = (imageBase64: string, downloadedAt: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageBase64}`;
    const date = new Date(downloadedAt);
    const fileName = `ai-mockup-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-20">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold">No Downloads Yet</h2>
        <p className="mt-2 text-gray-400">
          Once you generate and download mockups, they will appear here.
        </p>
        <button
          onClick={onGoHome}
          className="mt-6 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-indigo-500 transition duration-300"
        >
          Generate Mockups
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Your Download History
        </h2>
        <p className="mt-2 text-lg text-gray-400">
          All your previously downloaded mockups are saved here for your convenience.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {history.map((item) => (
          <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden group transition-all duration-300 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-900/50 flex flex-col">
            <div className="p-2 bg-gray-900">
              <img
                src={`data:image/png;base64,${item.imageData}`}
                alt={`Downloaded on ${new Date(item.downloadedAt).toLocaleDateString()}`}
                className="w-full h-auto object-contain rounded-md aspect-[4/3]"
              />
            </div>
            <div className="p-4 mt-auto flex flex-col">
              <p className="text-xs text-gray-500 mb-3">
                Downloaded on: {new Date(item.downloadedAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleDownload(item.imageData, item.downloadedAt)}
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-500 transition duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Download Again</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

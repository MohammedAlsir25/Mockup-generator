import React, { useRef } from 'react';

interface UrlInputFormProps {
  url: string;
  setUrl: (url: string) => void;
  screenshotFile: File | null;
  setScreenshotFile: (file: File | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ url, setUrl, screenshotFile, setScreenshotFile, onSubmit, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScreenshotFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-4">
        <div>
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-1">
            Website URL (Optional)
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
            disabled={isLoading}
          />
        </div>

        <div>
           <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-1">
            Upload Screenshot*
          </label>
          <div 
            className="flex items-center justify-center w-full h-32 px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
             <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
            {screenshotFile ? (
               <div className="text-center">
                <p className="font-semibold text-indigo-400">{screenshotFile.name}</p>
                <p className="text-sm text-gray-400">Click to change file</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-semibold text-gray-400">Click to upload an image</p>
                <p className="text-sm text-gray-500">PNG, JPG, or WEBP</p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !screenshotFile}
          className="w-full bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? 'Generating Showcase...' : 'Generate Redesigns'}
        </button>
      </form>
    </div>
  );
};
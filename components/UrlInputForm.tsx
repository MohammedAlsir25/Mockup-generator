import React, { useRef, useState } from 'react';
import { Tooltip } from './Tooltip';

interface UrlInputFormProps {
  url: string;
  setUrl: (url: string) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const UrlInputForm: React.FC<UrlInputFormProps> = ({ url, setUrl, files, setFiles, onSubmit, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    // URL is optional, so if it's empty, clear any errors.
    if (newUrl.trim() === '') {
        setUrlError(null);
        return;
    }
    
    // Add a protocol if it's missing for validation purposes.
    // This allows users to type "example.com" without it being flagged as invalid.
    let urlToValidate = newUrl;
    if (!urlToValidate.startsWith('http://') && !urlToValidate.startsWith('https://')) {
        urlToValidate = `https://${urlToValidate}`;
    }

    try {
        // The URL constructor is a robust way to validate URLs.
        // We also check if the hostname has a dot, which is a common characteristic
        // of valid public domain names (e.g., 'example.com' vs 'example').
        const parsedUrl = new URL(urlToValidate);
        if (!parsedUrl.hostname.includes('.')) {
            throw new Error('Invalid hostname');
        }
        setUrlError(null);
    } catch (error) {
        setUrlError('Please enter a valid URL format.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!isLoading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
      e.dataTransfer.clearData();
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlError) return;
    onSubmit();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 space-y-6">
        <div>
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-1">
            Website URL (Optional)
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com"
            className={`w-full px-4 py-3 bg-gray-800 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none ${urlError ? 'border-red-500' : 'border-gray-600'}`}
            disabled={isLoading}
            aria-invalid={!!urlError}
            aria-describedby="url-error"
          />
          {urlError && <p id="url-error" className="text-red-400 text-sm mt-2">{urlError}</p>}
        </div>

        <div>
           <label htmlFor="file-upload-url" className="block text-sm font-medium text-gray-300 mb-2">
            Upload Screenshots*
          </label>
          <div 
            className={`flex flex-col items-center justify-center w-full min-h-48 p-4 bg-gray-800 border-2 border-dashed border-gray-600 rounded-md transition-colors ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer hover:border-indigo-500'} ${isDragging ? 'border-indigo-500 bg-gray-700/50' : ''}`}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
            onDrop={handleDrop}
          >
             <input
              id="file-upload-url"
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
              multiple
              disabled={isLoading}
            />
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="font-semibold text-gray-400 mt-2">Click to upload or drag & drop</p>
              <p className="text-sm text-gray-500">PNG, JPG, or WEBP. Upload as many as you need.</p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Selected Files:</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                    className="w-full h-24 object-cover rounded-md"
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-0 right-0 -m-1 p-0.5 bg-red-600/80 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    aria-label={`Remove ${file.name}`}
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.697a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Tooltip text="Free users get 3 free mockup downloads per day. Upgrade to Pro for unlimited downloads.">
          <button
            type="submit"
            disabled={isLoading || files.length === 0 || !!urlError}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? 'Generating Showcase...' : 'Generate Redesigns'}
          </button>
        </Tooltip>
      </form>
    </div>
  );
};
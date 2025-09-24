import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { Spinner } from './components/Spinner';
import { generateRedesignMockup, generateMockupFromScreenshots } from './services/geminiService';
import { Hero } from './components/Hero';
import { ImageResultDisplay } from './components/ImageResultDisplay';
import { ModeSelector } from './components/ModeSelector';
import { ScreenshotInputForm } from './components/ScreenshotInputForm';

// Helper to read file as base64
const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string; }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const mimeType = result.split(':')[1].split(';')[0];
      const data = result.split(',')[1];
      resolve({ data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [mode, setMode] = useState<'url' | 'screenshots' | null>(null);
  const [url, setUrl] = useState<string>('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null); // For URL mode
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]); // For screenshots mode
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);

  const resetState = useCallback(() => {
    setUrl('');
    setScreenshotFile(null);
    setScreenshotFiles([]);
    setIsLoading(false);
    setError(null);
    setGeneratedImages(null);
  }, []);
  
  const handleModeSelect = useCallback((selectedMode: 'url' | 'screenshots') => {
    resetState();
    setMode(selectedMode);
  }, [resetState]);
  
  const handleBack = useCallback(() => {
    resetState();
    setMode(null);
  }, [resetState]);

  const handleUrlRedesign = useCallback(async () => {
    if (!screenshotFile) {
      setError('Please upload a screenshot of your website.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const { data: imageBase64, mimeType } = await fileToBase64(screenshotFile);
      const image = await generateRedesignMockup(url, imageBase64, mimeType);
      setGeneratedImages([image]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [url, screenshotFile]);

  const handleScreenshotsMockup = useCallback(async () => {
    if (screenshotFiles.length === 0) {
        setError('Please upload at least one screenshot.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
        const imageParts = await Promise.all(
            screenshotFiles.map(async (file) => {
                const { data, mimeType } = await fileToBase64(file);
                return {
                    inlineData: { data, mimeType },
                };
            })
        );

        const images = await generateMockupFromScreenshots(imageParts);
        setGeneratedImages(images);
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
        setIsLoading(false);
    }
  }, [screenshotFiles]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-16">
        <Hero />
        
        {!mode && <ModeSelector onSelectMode={handleModeSelect} />}

        {mode && (
          <div className="max-w-2xl mx-auto mb-6">
            <button
              onClick={handleBack}
              className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center text-sm"
              aria-label="Go back to method selection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Change Method
            </button>
          </div>
        )}

        {mode === 'url' && (
            <UrlInputForm
            url={url}
            setUrl={setUrl}
            screenshotFile={screenshotFile}
            setScreenshotFile={setScreenshotFile}
            onSubmit={handleUrlRedesign}
            isLoading={isLoading}
            />
        )}

        {mode === 'screenshots' && (
            <ScreenshotInputForm
                files={screenshotFiles}
                setFiles={setScreenshotFiles}
                onSubmit={handleScreenshotsMockup}
                isLoading={isLoading}
            />
        )}

        {isLoading && (
          <div className="text-center mt-12">
            <Spinner />
            <p className="text-lg text-indigo-400 mt-4 animate-pulse">
              {mode === 'url' ? 'Analyzing your site & generating thematic redesigns...' : 'Synthesizing screenshots & generating new mockups...'}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center mt-12 bg-red-900/50 border border-red-500 p-4 rounded-lg max-w-2xl mx-auto">
            <p className="text-red-300 font-semibold">Error</p>
            <p className="text-red-400 mt-2">{error}</p>
          </div>
        )}

        {generatedImages && !isLoading && generatedImages.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-10">
              {generatedImages.length > 1 ? 'Your AI-Generated Mockups' : 'Your AI-Generated Showcase'}
            </h2>
            <ImageResultDisplay images={generatedImages} />
          </div>
        )}
      </main>
      <footer className="text-center py-6 border-t border-gray-700/50 text-gray-500">
        <p>&copy; 2024 AI UI Mockup Generator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
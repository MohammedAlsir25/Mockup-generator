import React, { useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleLogin as firebaseLogin, handleSignUp as firebaseSignUp, handleLogout as firebaseLogout } from './services/firebase';

import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { Spinner } from './components/Spinner';
import { generateRedesignMockup, generateMockupFromScreenshots } from './services/geminiService';
import { Hero } from './components/Hero';
import { ImageResultDisplay } from './components/ImageResultDisplay';
import { ModeSelector } from './components/ModeSelector';
import { ScreenshotInputForm } from './components/ScreenshotInputForm';
import { PricingPage } from './components/PricingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { PaymentModal } from './components/PaymentModal';
import { isGeminiConfigured, isFirebaseConfigured } from './config';
import { ConfigurationError } from './components/ConfigurationError';

// Helper to read file as base64
const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string; }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const data = result.split(',')[1];
      resolve({ data, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

type View = 'generator' | 'pricing' | 'login' | 'signup';
type User = { uid: string; email: string | null; plan: 'free' | 'pro'; downloadCount: number; };

const App: React.FC = () => {
  const [view, setView] = useState<View>('generator');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authIsLoading, setAuthIsLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [postAuthAction, setPostAuthAction] = useState<'upgrade' | null>(null);
  
  // Generator state
  const [mode, setMode] = useState<'url' | 'screenshots' | null>(null);
  const [url, setUrl] = useState<string>('');
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);

  // Check for API key configuration on startup
  if (!isGeminiConfigured() || !isFirebaseConfigured()) {
    return <ConfigurationError />;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in.
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
        }
        setIsAuthenticated(true);

        // Handle post-auth actions
        if (postAuthAction === 'upgrade') {
          setView('pricing');
          setPostAuthAction(null);
        } else if (view === 'login' || view === 'signup') {
          // After login/signup, go to generator, potentially to see results.
          setView('generator');
        }
      } else {
        // User is signed out.
        setUser(null);
        setIsAuthenticated(false);
      }
      setAuthIsLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [postAuthAction, view]);

  const resetGeneratorState = useCallback(() => {
    setUrl('');
    setScreenshotFiles([]);
    setIsLoading(false);
    setError(null);
    setGeneratedImages(null);
    setMode(null);
  }, []);

  const handleNavigate = (newView: View) => {
    setView(newView);
  };

  const handleGoHome = () => {
    resetGeneratorState();
    setView('generator');
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    await firebaseLogin(email, password);
    // onAuthStateChanged will handle the rest
  };
  
  const handleSignUp = async (email: string, password: string): Promise<void> => {
    const userCredential = await firebaseSignUp(email, password);
    const firebaseUser = userCredential.user;
    // Create a new document for the user in Firestore
    await setDoc(doc(db, "users", firebaseUser.uid), {
      email: firebaseUser.email,
      plan: 'free',
      downloadCount: 0,
    });
    // onAuthStateChanged will handle the rest
  };
  
  const handleLogout = async () => {
    await firebaseLogout();
    resetGeneratorState();
    setView('generator');
  };

  const handleUpgrade = () => {
    if (isAuthenticated) {
      setIsPaymentModalOpen(true);
    } else {
      setPostAuthAction('upgrade');
      setView('login');
    }
  };
  
  const handlePaymentSuccess = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { plan: 'pro' });
      setUser({ ...user, plan: 'pro' }); // Update local state immediately
    }
    setIsPaymentModalOpen(false);
    setView('generator');
  };
  
  const handleDownloadSuccess = async () => {
    if (user && user.plan === 'free') {
      const newCount = user.downloadCount + 1;
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { downloadCount: newCount });
      setUser({ ...user, downloadCount: newCount }); // Update local state immediately
    }
  };

  const handleModeSelect = useCallback((selectedMode: 'url' | 'screenshots') => {
    setGeneratedImages(null);
    setError(null);
    setMode(selectedMode);
  }, []);
  
  const handleBack = useCallback(() => {
    setMode(null);
    setGeneratedImages(null);
    setError(null);
  }, []);

  const handleUrlRedesign = useCallback(async () => {
    if (screenshotFiles.length === 0) {
      setError('Please upload at least one screenshot of your website.');
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
      const images = await generateRedesignMockup(url, imageParts);
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [url, screenshotFiles]);

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

  const renderContent = () => {
    if (authIsLoading) {
        return (
            <div className="text-center mt-20">
                <Spinner />
                <p className="text-lg text-indigo-400 mt-4">Loading Application...</p>
            </div>
        );
    }
      
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'signup':
        return <SignUpPage onSignUp={handleSignUp} onNavigate={handleNavigate} />;
      case 'pricing':
        return <PricingPage onUpgrade={handleUpgrade} />;
      case 'generator':
      default:
        return (
          <>
            {!generatedImages && !isLoading && <Hero />}
            
            {!mode && !generatedImages && !isLoading && <ModeSelector onSelectMode={handleModeSelect} />}

            {mode && !generatedImages && !isLoading && (
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

            {mode === 'url' && !generatedImages && !isLoading && (
                <UrlInputForm
                url={url}
                setUrl={setUrl}
                files={screenshotFiles}
                setFiles={setScreenshotFiles}
                onSubmit={handleUrlRedesign}
                isLoading={isLoading}
                />
            )}

            {mode === 'screenshots' && !generatedImages && !isLoading && (
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
                  {mode === 'url' ? 'Analyzing your screenshots & generating showcase mockups...' : 'Synthesizing screenshots & generating new mockups...'}
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
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">
                    Your AI-Generated Mockups
                    </h2>
                    {!isAuthenticated && <p className="text-yellow-400 mt-2">Sign up to view your results in high resolution and download your first mockup for free!</p>}
                </div>
                <ImageResultDisplay
                  images={generatedImages}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onNavigate={handleNavigate}
                  onDownloadSuccess={handleDownloadSuccess}
                />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated}
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
      />
      <main className="container mx-auto px-4 py-8 md:py-16 flex-grow">
        {renderContent()}
      </main>
      <footer className="text-center py-6 border-t border-gray-700/50 text-gray-500">
        <p>&copy; 2024 AI UI Mockup Generator. All rights reserved.</p>
      </footer>

      {isPaymentModalOpen && (
        <PaymentModal 
            onSuccess={handlePaymentSuccess} 
            onClose={() => setIsPaymentModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
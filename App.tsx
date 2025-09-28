import React, { useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser, getAdditionalUserInfo } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleLogin as firebaseLogin, handleSignUp as firebaseSignUp, handleLogout as firebaseLogout, handleGoogleLogin as firebaseGoogleLogin } from './services/firebase';

import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { Spinner } from './components/Spinner';
import { generateMockup } from './services/geminiService';
import { Hero } from './components/Hero';
import { ImageResultDisplay } from './components/ImageResultDisplay';
import { ModeSelector } from './components/ModeSelector';
import { ScreenshotInputForm } from './components/ScreenshotInputForm';
import { PricingPage } from './components/PricingPage';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { PaymentModal } from './components/PaymentModal';
import { isGeminiConfigured, isFirebaseConfigured, isPaypalConfigured } from './config';
import { ConfigurationError } from './components/ConfigurationError';
import { HistoryPage } from './components/HistoryPage';
import { FREE_USER_DAILY_DOWNLOAD_LIMIT } from './constants';

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

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().split('T')[0];

type View = 'generator' | 'pricing' | 'login' | 'signup' | 'history';
type User = { uid: string; email: string | null; plan: 'free' | 'pro'; downloadCount: number; lastDownloadDate?: string; };
interface HistoryItem { id: string; imageData: string; downloadedAt: string; };

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
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Check for API key configuration on startup
  if (!isGeminiConfigured() || !isFirebaseConfigured() || !isPaypalConfigured()) {
    return <ConfigurationError />;
  }
  
  // Effect for cycling loading messages
  useEffect(() => {
    let interval: number;
    if (isLoading) {
        const messages = [
            "Warming up the AI's creative circuits...",
            "Sketching out initial concepts...",
            "Analyzing color palettes and layouts...",
            "Consulting the muses of design...",
            "Rendering high-resolution mockups...",
            "Adding the final finishing touches...",
        ];
        let messageIndex = 0;
        setLoadingMessage(messages[messageIndex]); // Set initial message
        interval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            setLoadingMessage(messages[messageIndex]);
        }, 3000);
    }
    return () => clearInterval(interval);
}, [isLoading]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in.
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          const today = getTodayDateString();
          
          // Ensure plan is one of the two allowed values
          const plan: 'free' | 'pro' = data.plan === 'pro' ? 'pro' : 'free';

          let downloadCount = Number(data.downloadCount || 0);
          let lastDownloadDate = ''; // Default to a primitive string

          // Safely extract and convert lastDownloadDate, which might be a Firestore Timestamp
          if (data.lastDownloadDate) {
              if (typeof data.lastDownloadDate.toDate === 'function') {
                  // If it's a Timestamp, convert it to a YYYY-MM-DD string for comparison
                  lastDownloadDate = data.lastDownloadDate.toDate().toISOString().split('T')[0];
              } else {
                  // Otherwise, treat it as a string
                  lastDownloadDate = String(data.lastDownloadDate);
              }
          }

          // Reset daily download count for free users if the last download was not today
          if (plan === 'free' && lastDownloadDate && lastDownloadDate !== today) {
            downloadCount = 0;
          }

          // Create a new, clean user object with guaranteed primitive values to prevent serialization errors.
          const cleanUser: User = {
            uid: firebaseUser.uid,
            email: String(data.email || firebaseUser.email || ''),
            plan: plan,
            downloadCount: downloadCount,
            lastDownloadDate: lastDownloadDate,
          };
          
          setUser(cleanUser);
        }
        setIsAuthenticated(true);
        
        // Load history from localStorage
        const storedHistory = localStorage.getItem(`downloadHistory_${firebaseUser.uid}`);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }

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
        setHistory([]); // Clear history on logout
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
      lastDownloadDate: '', // Initialize last download date
    });
    // onAuthStateChanged will handle the rest
  };

  const handleGoogleLogin = async (): Promise<void> => {
    const userCredential = await firebaseGoogleLogin();
    const additionalInfo = getAdditionalUserInfo(userCredential);
    
    // If it's a new user, create their document in Firestore
    if (additionalInfo?.isNewUser) {
      const firebaseUser = userCredential.user;
      await setDoc(doc(db, "users", firebaseUser.uid), {
        email: firebaseUser.email,
        plan: 'free',
        downloadCount: 0,
        lastDownloadDate: '',
      });
    }
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
  
  const handleDownloadSuccess = async (imageBase64: string) => {
    if (user) {
      // Update daily download count for free users in Firestore
      if (user.plan === 'free') {
        const today = getTodayDateString();
        const newCount = (user.lastDownloadDate === today) ? user.downloadCount + 1 : 1;
        
        if (newCount <= FREE_USER_DAILY_DOWNLOAD_LIMIT) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, { 
            downloadCount: newCount,
            lastDownloadDate: today,
          });
          setUser({ ...user, downloadCount: newCount, lastDownloadDate: today });
        }
      }

      // Save to localStorage history
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString() + Math.random(), // Simple unique ID
        imageData: imageBase64,
        downloadedAt: new Date().toISOString(),
      };
      // Prepend to show the latest first
      const updatedHistory = [newHistoryItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(`downloadHistory_${user.uid}`, JSON.stringify(updatedHistory));
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

  const handleGenerateMockup = useCallback(async () => {
    if (screenshotFiles.length === 0) {
        setError('Please upload at least one screenshot.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
        const imageParts = await Promise.all(
            screenshotFiles.map(file => fileToBase64(file))
        );
        
        const images = await generateMockup(imageParts.map(part => ({
            inlineData: { data: part.data, mimeType: part.mimeType }
        })));
        
        setGeneratedImages(images);
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
        setIsLoading(false);
    }
  }, [screenshotFiles]);

  const renderContent = () => {
    // Show a skeleton loader while auth state is being determined
    if (authIsLoading) {
      return (
          <div className="text-center mt-20">
              <Spinner />
          </div>
      );
    }
      
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
      case 'signup':
        return <SignUpPage onSignUp={handleSignUp} onGoogleLogin={handleGoogleLogin} onNavigate={handleNavigate} />;
      case 'pricing':
        return <PricingPage onUpgrade={handleUpgrade} />;
      case 'history':
        return <HistoryPage history={history} onGoHome={handleGoHome} />;
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
                onSubmit={handleGenerateMockup}
                isLoading={isLoading}
                />
            )}

            {mode === 'screenshots' && !generatedImages && !isLoading && (
                <ScreenshotInputForm
                    files={screenshotFiles}
                    setFiles={setScreenshotFiles}
                    onSubmit={handleGenerateMockup}
                    isLoading={isLoading}
                />
            )}

            {isLoading && (
              <div className="text-center mt-12">
                <Spinner />
                <p className="text-lg text-indigo-400 mt-4 animate-pulse">
                  {loadingMessage}
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
                    {!isAuthenticated && <p className="text-yellow-400 mt-2">Sign up to view your results in high resolution and download your first mockups for free!</p>}
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

  // Render header/footer shell immediately for better perceived performance
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
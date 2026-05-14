// =================================================================================
// IMPORTANT: ACTION REQUIRED - SETUP YOUR API KEYS
// =================================================================================
// This file holds your secret API keys configuration.
// You must replace the placeholder text with your actual keys for the app to work.
//
// ⚠️  SECURITY WARNING:
// Do NOT commit this file with your actual keys to a public repository.
// Use environment variables instead! See setup instructions below.
// =================================================================================

/**
 * SETUP INSTRUCTIONS - FOLLOW THESE STEPS:
 * 
 * 1. GET GOOGLE GEMINI API KEY
 *    This key allows the app to generate images.
 *    - Go to Google AI Studio: https://aistudio.google.com/app/apikey
 *    - Click "Get API Key" → "Create API key in new project"
 *    - Copy your API key
 * 
 * 2. GET FIREBASE CONFIGURATION
 *    This is needed for user login and database features.
 *    - Go to Firebase Console: https://console.firebase.google.com/
 *    - Create a new project or select existing one
 *    - Go to Project Settings → "Your apps" section
 *    - Click on your web app to see the config object
 *    - Copy all the configuration values (apiKey, authDomain, etc.)
 * 
 * 3. GET PAYPAL CLIENT ID
 *    This key is required to process payments for the Pro plan.
 *    - Go to PayPal Developer Dashboard: https://developer.paypal.com/developer/applications/
 *    - Create a REST API app to get your "Client ID"
 *    - Use the Sandbox Client ID for testing
 * 
 * RECOMMENDED: USE ENVIRONMENT VARIABLES
 * =====================================
 * Instead of hardcoding keys here, use environment variables:
 * 
 * 1. Create a .env.local file in your project root (NEVER commit this file):
 * 
 *    VITE_GEMINI_API_KEY=your_actual_gemini_key_here
 *    VITE_FIREBASE_API_KEY=AIzaSyCF_v2QUz4eA81xAFer3la7xhoIAjd0gXs
 *    VITE_FIREBASE_AUTH_DOMAIN=mockup-generator-78564.firebaseapp.com
 *    VITE_FIREBASE_DATABASE_URL=https://mockup-generator-78564-default-rtdb.firebaseio.com
 *    VITE_FIREBASE_PROJECT_ID=mockup-generator-78564
 *    VITE_FIREBASE_STORAGE_BUCKET=mockup-generator-78564.firebasestorage.app
 *    VITE_FIREBASE_MESSAGING_SENDER_ID=514284782806
 *    VITE_FIREBASE_APP_ID=1:514284782806:web:4e5ea0c6bb2bd471c47577
 *    VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
 * 
 * 2. The config below will automatically read from these variables
 * 
 * 3. Add .env.local to your .gitignore file:
 *    .env.local
 *    .env.*.local
 * 
 * For production/deployment (Vercel, Netlify, etc.):
 * - Add these same environment variables in your platform's dashboard
 * - They will be securely stored and used during deployment
 */

/**
 * Your Google Gemini API Key for AI image generation.
 * Reads from environment variable: VITE_GEMINI_API_KEY
 */
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";


/**
 * Your Firebase project configuration for authentication, database, and storage.
 * Reads from environment variables: VITE_FIREBASE_*
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_FIREBASE_AUTH_DOMAIN_HERE",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "YOUR_DATABASE_URL_HERE",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_FIREBASE_PROJECT_ID_HERE",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_FIREBASE_STORAGE_BUCKET_HERE",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_FIREBASE_MESSAGING_SENDER_ID_HERE",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_FIREBASE_APP_ID_HERE"
};

/**
 * Your PayPal Client ID for processing payments.
 * Use your Sandbox Client ID for testing.
 * Reads from environment variable: VITE_PAYPAL_CLIENT_ID
 */
export const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID_HERE";




// --- Configuration Checks ---
// These helpers are used to determine if the user has filled in their API keys.

/**
 * Checks if the Gemini API key has been set.
 * @returns {boolean} True if the key is not a placeholder.
 */
export const isGeminiConfigured = (): boolean => {
    return !GEMINI_API_KEY.startsWith("YOUR_");
}

/**
 * Checks if the Firebase configuration has been set.
 * @returns {boolean} True if the configuration is not a placeholder.
 */
export const isFirebaseConfigured = (): boolean => {
    return !firebaseConfig.apiKey.startsWith("YOUR_");
}

/**
 * Checks if the PayPal Client ID has been set.
 * @returns {boolean} True if the key is not a placeholder.
 */
export const isPaypalConfigured = (): boolean => {
    return !PAYPAL_CLIENT_ID.startsWith("YOUR_");
}

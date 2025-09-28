// =================================================================================
// IMPORTANT: ACTION REQUIRED
// =================================================================================
// This file holds your secret API keys.
// You must replace the placeholder text with your actual keys for the app to work.
//
// HOW TO GET YOUR KEYS:
//
// 1. GEMINI_API_KEY:
//    - Go to Google AI Studio: https://aistudio.google.com/app/apikey
//    - Create and copy your API key.
//
// 2. firebaseConfig:
//    - Go to your Firebase project settings: https://console.firebase.google.com/
//    - In the "General" tab, find your web app's config object.
//    - Copy the values for each key (apiKey, authDomain, etc.).
//
// 3. PAYPAL_CLIENT_ID:
//    - Go to the PayPal Developer Dashboard: https://developer.paypal.com/developer/applications/
//    - Create a REST API app to get your "Client ID". Use the Sandbox ID for testing.
//
// SECURITY WARNING:
// Do NOT commit this file with your actual keys to a public repository.
// Use a .gitignore file to exclude it from version control.
// =================================================================================


/**
 * Your Google Gemini API Key for AI image generation.
 */
export const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";


/**
 * Your Firebase project configuration for authentication, database, and storage.
 */
export const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN_HERE",
  projectId: "YOUR_FIREBASE_PROJECT_ID_HERE",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_FIREBASE_APP_ID_HERE"
};

/**
 * Your PayPal Client ID for processing payments.
 * Use your Sandbox Client ID for testing.
 */
export const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID_HERE";




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
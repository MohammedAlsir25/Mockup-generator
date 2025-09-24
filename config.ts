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
// SECURITY WARNING:
// Do NOT commit this file with your actual keys to a public repository.
// Use a .gitignore file to exclude it from version control.
// =================================================================================


/**
 * Your Google Gemini API Key for AI image generation.
 */
export const GEMINI_API_KEY = "AIzaSyA_cQysTvQoDObq5giQ0gF4wDtKXvU8LwM";


/**
 * Your Firebase project configuration for authentication, database, and storage.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCF_v2QUz4eA81xAFer3la7xhoIAjd0gXs",
  authDomain: "mockup-generator-78564.firebaseapp.com",
  projectId: "mockup-generator-78564",
  storageBucket: "mockup-generator-78564.firebasestorage.app", // e.g., "my-project.appspot.com"
  messagingSenderId: "514284782806",
  appId: "1:514284782806:web:4e5ea0c6bb2bd471c47577"
};


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
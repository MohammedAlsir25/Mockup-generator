# AI UI Mockup Generator

An AI-powered platform that transforms website screenshots into five unique, professional, and marketable UI/UX mockup images. This tool is designed for developers, designers, and marketers who want to create stunning promotional materials for their web projects with minimal effort.

---

## Key Features

-   **Advanced AI Generation**: Leverages the Google Gemini API to analyze screenshots and generate five distinct, high-quality promotional cover images.
-   **Dual Input Modes**: Generate mockups by providing a website URL and screenshots, or by directly uploading a collection of screenshots.
-   **User Authentication**: Secure user registration and login system supporting both Email/Password and Google Sign-In, powered by Firebase Authentication.
-   **Password Management**: Includes a "Forgot Password?" feature that uses Firebase's secure email-based reset flow.
-   **Pro Plan & Payments**: A "Pro" plan for unlimited downloads, with a fully integrated (sandbox) PayPal payment system.
-   **Generous Free Tier**: Free users receive a daily allowance of mockup downloads, with limits tracked and reset automatically.
-   **Download History**: Authenticated users can view and re-download all their previously generated mockups from a dedicated history page.
-   **Dynamic UI & UX**: Features a responsive design, smooth loading states with dynamic messages, tooltips for clarity, and a robust error handling system to guide the user.
-   **Easy Setup**: Includes a built-in configuration screen that guides developers to set up the necessary API keys.

## Technologies Used

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **AI Model**: Google Gemini API (`gemini-2.5-flash-image-preview`)
-   **Backend & Database**: Firebase (Authentication, Firestore)
-   **Payments**: PayPal Developer API (Sandbox)
-   **Module Loading**: ES Modules with `importmap` (no bundler required)

---

## Getting Started

This project is configured to run directly in the browser without a build step, thanks to ES Modules and `importmap`. Follow these steps to get it running locally.

### Prerequisites

You need a simple local web server to serve the files. The easiest way is to use `npx serve`. If you don't have Node.js installed, you can download it from [nodejs.org](https://nodejs.org/).

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-mockup-generator.git
cd ai-mockup-generator
```

### 2. Configuration (Crucial Step)

This application requires API keys from three different services to function. The app has a built-in checker that will guide you if any keys are missing.

1.  Locate the configuration file at `config.ts`.
2.  You will need to replace the placeholder values with your actual keys.

#### **A. Google Gemini API Key**

This key is required for all AI image generation features.

-   Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
-   Click **"Create API key"** and copy the generated key.
-   Paste it into the `GEMINI_API_KEY` variable in `config.ts`.

#### **B. PayPal Client ID**

This key is required for the payment modal to function.

-   Go to the **[PayPal Developer Dashboard](https://developer.paypal.com/developer/applications/)**.
-   Log in with your PayPal account.
-   Ensure you are in the **"Sandbox"** environment (toggle at the top).
-   Click **"Create App"**, give it a name (e.g., "Mockup App Test"), and click "Create App" again.
-   On the next screen, copy your **Client ID**.
-   Paste it into the `PAYPAL_CLIENT_ID` variable in `config.ts`.

#### **C. Firebase Project Configuration**

This is required for user authentication and the database. This is the most involved step.

**I. Create the Project:**
- Go to the **[Firebase Console](https://console.firebase.google.com/)**.
- Click **"Add project"** and follow the on-screen instructions.

**II. Get Web App Config:**
- In your project's dashboard, click the Web icon (`</>`) to add a web app.
- Register your app (give it a nickname).
- After registration, Firebase will show you a `firebaseConfig` object. Copy this entire object and use its values to replace the placeholder values in `config.ts`.

**III. Enable Authentication Methods:**
- In the Firebase Console, go to **Authentication** (in the left "Build" menu).
- Click the **"Sign-in method"** tab.
- Enable both **Email/Password** and **Google** providers. For the Google provider, you'll need to select a project support email.

**IV. Set Up Authorized Domains:**
- While still in Authentication settings, go to the **"Settings"** tab.
- Under **"Authorized domains"**, click **"Add domain"**.
- Add **`localhost`** for local development.
- *Note: When you deploy your site, you will need to return here and add your live URL (e.g., `your-app.netlify.app`).*

**V. Configure Firestore Database Rules:**
- In the Firebase Console, go to **Firestore Database**.
- Click **"Create database"** and start in **Production mode**. Choose a location closest to your users.
- After the database is created, click the **"Rules"** tab.
- **Replace the entire content** of the rules editor with the following:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // Allow users to read and write their own user document
      match /users/{userId} {
        allow read, update, delete: if request.auth != null && request.auth.uid == userId;
        allow create: if request.auth != null;
      }
    }
  }
  ```
- Click **"Publish"**. This is a critical security step that allows logged-in users to manage their own data.

### 3. Run the Application

Once your `config.ts` file is filled out, you can run the app.

1.  Open your terminal in the project's root directory.
2.  Start a simple local server:
    ```bash
    npx serve
    ```
3.  The terminal will output a URL, usually `http://localhost:3000`. Open this URL in your browser.

---

## Project Structure

```
/
├── index.html              # Main HTML entry point, contains the importmap
├── index.tsx               # Renders the React application
├── README.md               # This file
├── App.tsx                 # Core application component, manages all state and views
├── config.ts               # IMPORTANT: API keys and configuration checks
├── constants.ts            # Application-wide constants (e.g., download limits)
├── services/
│   ├── firebase.ts         # Firebase initialization and auth functions
│   └── geminiService.ts    # Logic for interacting with the Gemini API
└── components/
    ├── Alert.tsx           # Reusable component for success/error messages
    ├── Header.tsx          # Top navigation bar
    ├── HistoryPage.tsx     # Displays user's download history
    ├── LoginPage.tsx         # User login form
    ├── PasswordResetModal.tsx# Modal for the 'Forgot Password' flow
    ├── PaymentModal.tsx      # Handles the PayPal payment flow
    ├── PricingPage.tsx     # Displays the pricing plans
    ├── SignUpPage.tsx        # User registration form
    └── ...                 # Other UI components
```

## Deployment

You can easily deploy this project as a static site to services like Netlify, Vercel, or GitHub Pages.

**Important Deployment Step**: After deploying, you must add your live site's URL (e.g., `your-app-name.netlify.app`) to the **Authorized Domains** list in your Firebase Authentication settings, as described in the configuration steps above. Otherwise, Google Sign-In will not work on the deployed site.

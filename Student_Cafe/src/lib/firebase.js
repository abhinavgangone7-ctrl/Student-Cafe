// Import the functions we need from the Firebase SDK.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For User Login/Signup
import { getFirestore } from "firebase/firestore"; // For the Database

// Your Web App's Firebase configuration.
// These values are pulled from the ".env" file (environment variables).
// Why? keeping them in .env makes it easier to swap between "Dev" and "Prod" projects
// without changing the code, and keeps secrets out of the codebase (sort of - these are public keys).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Identifies your app to Google
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, // Where users are redirected for login
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // Your specific project ID
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Where images are stored
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // For push notifications
  appId: import.meta.env.VITE_FIREBASE_APP_ID, // Unique ID for this specific app instance
};

// Initialize Firebase
// This starts the connection to Google's servers.
const app = initializeApp(firebaseConfig);

// Export the "auth" and "db" services so we can use them in other files.
// We export them here so we only run "getAuth(app)" ONCE in the entire app.
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

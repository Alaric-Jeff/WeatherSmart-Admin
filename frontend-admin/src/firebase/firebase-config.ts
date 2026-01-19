// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkPtysjodxh356vyuQSaAhg59xjeHjMVU",
  authDomain: "smart-drying-iot.firebaseapp.com",
  databaseURL: "https://smart-drying-iot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-drying-iot",
  storageBucket: "smart-drying-iot.firebasestorage.app",
  messagingSenderId: "346631879936",
  appId: "1:346631879936:web:8bbd6c286ca6a3d9ec47e5",
  measurementId: "G-PNJNCYJWC2"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Export the Auth instance (required for sign-in, sessions, tokens)
export const auth = getAuth(app);

// Optional: Analytics (safe guard for browser-only)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Export app only if needed elsewhere
export default app;

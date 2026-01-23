import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "student-cafe-app-v1-9382",
  appId: "1:617205817982:web:321ac18746efcb2f2cee2f",
  storageBucket: "student-cafe-app-v1-9382.firebasestorage.app",
  apiKey: "AIzaSyD9laekh65sopXzCUxsestR74kMDLMhg7g",
  authDomain: "student-cafe-app-v1-9382.firebaseapp.com",
  messagingSenderId: "617205817982",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

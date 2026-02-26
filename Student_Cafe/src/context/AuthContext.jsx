// React hooks for managing state and sharing it across the app.
import { createContext, useContext, useEffect, useState } from "react";
// Firebase Authentication methods.
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "firebase/auth";
// Import our initialized firebase auth instance.
import { auth } from "../lib/firebase";

// 1. Create the Context
// Think of this as a "Global Container" or "Radio Station" that broadcasts user info.
const AuthContext = createContext();

// 2. Create a Custom Hook
// This makes it easy for other components to "tune in" to the station.
// Usage: const { currentUser } = useAuth();
export const useAuth = () => useContext(AuthContext);

// 3. Create the Provider Component
// This component wraps the entire app (in App.jsx) and manages the actual data.
export const AuthProvider = ({ children }) => {
    // State to hold the current logged-in user (null if logged out).
    const [currentUser, setCurrentUser] = useState(null);
    // State to track if we are still checking if the user is logged in (initial load).
    const [loading, setLoading] = useState(true);

    // Function to log in with Google.
    // Opens a popup window for the user to select their Google account.
    const login = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    // Function to log in with Email and Password
    const loginWithEmail = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Function to sign up with Email and Password
    const signupWithEmail = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Function to log out.
    // Tells Firebase to end the session.
    const logout = () => {
        return signOut(auth);
    };

    // Effect: Listen for Auth Changes (Login/Logout) automatically.
    // This runs ONCE when the app starts.
    useEffect(() => {
        // 'onAuthStateChanged' is a Firebase listener. It triggers whenever the user logs in or out.
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // Update our state with the user object (or null).
            setLoading(false);    // We are done loading the initial state.
        });

        // Cleanup: When the app closes (unmounts), stop listening to avoid memory leaks.
        return unsubscribe;
    }, []);

    // The data we want to share with the rest of the app.
    const value = {
        currentUser,
        login,
        loginWithEmail,
        signupWithEmail,
        logout,
        loading
    };

    return (
        // Broadcast the 'value' to all children components.
        // We only render 'children' (the app) after 'loading' is false, prevents "flicker" of login screen.
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

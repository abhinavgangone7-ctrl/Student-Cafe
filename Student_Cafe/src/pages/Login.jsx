// Imports for Component State and Lifecycle
import { useState, useEffect } from "react";
// Hook to navigate programmatically
import { useNavigate } from "react-router-dom";
// Authentication Hook
import { useAuth } from "../context/AuthContext";
// Icons
import { Coffee, AlertCircle, Loader2 } from "lucide-react";
// Logging Utility
import { logger } from "../lib/logger";
// Rate Limiting Hook
import { useRateLimit } from "../hooks/useRateLimit";

const Login = () => {
    // 1. Get auth function and current user from our Context.
    const { login, loginWithEmail, signupWithEmail, currentUser } = useAuth();
    const navigate = useNavigate();

    // 2. Local State for UI feedback
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 3. Effect: Auto-Redirect if ALREADY logged in.
    // Why: We don't want a logged-in user staring at the login screen.
    useEffect(() => {
        if (currentUser) {
            navigate("/menu");
        }
    }, [currentUser, navigate]);

    // 4. Rate Limit: 3 Seconds. 
    // Prevents people from mashing the Google Login button.
    const checkRateLimit = useRateLimit("auth_login", 3000);

    // 5. Handle Login Click (Google)
    const handleGoogleLogin = async () => {
        try {
            checkRateLimit(); // Throws error if too fast
            setError("");
            setLoading(true);

            await login(); // Calls Firebase Google Popup

            // Navigation is handled automatically by the useEffect above
            // once currentUser is updated in AuthContext.
        } catch (error) {
            logger.error("AUTH", "User failed to sign in with Google.", error);
            setError("Failed to sign in. Please try again.");
            setLoading(false); // Only stop loading if there's an error. Success will unmount anyway.
        }
    };

    // 6. Handle Email Login/Sign Up
    const handleEmailAuth = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            checkRateLimit();
            setError("");
            setLoading(true);

            if (isSignUp) {
                await signupWithEmail(email, password);
            } else {
                await loginWithEmail(email, password);
            }
            // Navigation handled by useEffect
        } catch (error) {
            logger.error("AUTH", `User failed to ${isSignUp ? "sign up" : "sign in"} with Email.`, error);
            if (error.code === 'auth/email-already-in-use') {
                setError("This email is already registered. Please sign in.");
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setError("Invalid email or password.");
            } else if (error.code === 'auth/weak-password') {
                setError("Password should be at least 6 characters.");
            } else {
                setError(`Failed to ${isSignUp ? "sign up" : "sign in"}. Please try again.`);
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 bg-amber-500/10 rounded-full mb-4">
                            <Coffee className="w-8 h-8 text-amber-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-zinc-400">Sign in to start your order</p>
                    </div>

                    {/* Error Message Box (Only shows if there is an error) */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Email Auth Form */}
                    <form onSubmit={handleEmailAuth} className="mb-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
                                placeholder="you@student.cafe"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
                                placeholder="••••••••"
                                disabled={loading}
                                minLength="6"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-amber-500 text-amber-950 font-bold rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {!loading ? (isSignUp ? "Create Account" : "Sign In") : "Processing..."}
                        </button>
                    </form>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-zinc-900 text-zinc-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full h-12 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {!loading ? (
                            <>
                                {/* Google Logo SVG */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </>
                        ) : (
                            <span className="animate-pulse">Connecting...</span>
                        )}
                    </button>

                    <p className="mt-8 text-center text-sm text-zinc-400">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError("");
                            }}
                            className="text-amber-500 hover:text-amber-400 transition-colors font-medium"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>

                    <p className="mt-4 text-center text-xs text-zinc-600">
                        Secure Authentication by Firebase
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

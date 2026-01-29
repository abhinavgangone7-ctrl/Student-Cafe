import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Coffee, AlertCircle, Loader2 } from "lucide-react";
import { logger } from "../lib/logger";
import { useRateLimit } from "../hooks/useRateLimit";

const Login = () => {
    const { login, currentUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            navigate("/menu");
        }
    }, [currentUser, navigate]);

    const checkRateLimit = useRateLimit("auth_login", 3000); // 3 seconds cooldown

    const handleLogin = async () => {
        try {
            checkRateLimit();
            setError("");
            setLoading(true);
            await login();
            navigate("/menu");
        } catch (error) {
            logger.error("AUTH", "User failed to sign in with Google.", error);
            setError("Failed to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex p-3 bg-amber-500/10 rounded-full mb-4">
                            <Coffee className="w-8 h-8 text-amber-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-zinc-400">Sign in to start your order</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 text-sm">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full h-12 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {!loading ? (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26-.19-.58z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </>
                        ) : (
                            <span className="animate-pulse">Connecting...</span>
                        )}
                    </button>

                    <p className="mt-6 text-center text-xs text-zinc-600">
                        Secure Authentication by Firebase
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

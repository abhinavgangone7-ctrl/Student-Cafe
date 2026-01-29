import { Link, useLocation, useNavigate } from "react-router-dom";
import { Coffee, ShoppingBag, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { logger } from "../../lib/logger";


const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const { totalItems, openCart } = useCart();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            navigate("/"); // Navigate FIRST to avoid ProtectedRoute redirecting to /login
            await logout();
        } catch (error) {
            logger.error("AUTH", "Failed to log out.", error);
            // FAIL-SAFE: If firebase fails, tell user but don't trap them.
            alert("Check your connection. You may still be signed in on the server.");
            navigate("/"); // Graceful degradation
        }
    };

    // Only show feedback on billing related pages



    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 h-16">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl dark:text-white">
                    <Coffee className="w-6 h-6 text-amber-500" />
                    <span>Student Café</span>
                </Link>

                <div className="flex items-center gap-6">


                    <Link to="/menu" className="text-sm font-medium hover:text-amber-500 transition-colors dark:text-zinc-300">
                        Menu
                    </Link>

                    <button
                        onClick={openCart}
                        className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5 dark:text-white" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {currentUser ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors text-sm"
                            >
                                <User size={14} />
                                <span className="max-w-[100px] truncate">{currentUser.displayName || currentUser.email || 'User'}</span>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden">
                                    <Link
                                        to="/admin/dashboard"
                                        className="w-full text-left px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <Coffee size={14} />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2"
                                    >
                                        <LogOut size={14} />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-bold hover:opacity-80 transition-opacity"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>


        </nav>
    );
};

export default Navbar;

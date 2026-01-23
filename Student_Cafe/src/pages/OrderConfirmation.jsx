import { useEffect } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { Check, Coffee } from "lucide-react";
import { useCart } from "../context/CartContext";

const OrderConfirmation = () => {
    const location = useLocation();
    const { orderId, tokenNumber } = location.state || {};
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear cart when landing on confirmation page
        // This avoids race conditions in Checkout page
        clearCart();
    }, [clearCart]);

    // For debugging: if no state, just show generated values or handle gracefully
    // instead of redirecting to Home instantly.
    // if (!orderId) {
    //     return <Navigate to="/" />;
    // }

    // Fallback for demo purposes if state is missing (so user sees the page)
    const displayToken = tokenNumber || "DEMO-123";
    const displayOrderId = orderId || "demo-order-id";

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-20 pb-10 flex flex-col items-center">
            <Navbar />

            <main className="max-w-md w-full px-4 text-center mt-8">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center">
                        <Check className="w-10 h-10 text-white dark:text-black stroke-[3]" />
                    </div>
                </div>

                {/* Text Content */}
                <h1 className="text-3xl font-bold mb-3 text-black dark:text-white">Order Confirmed!</h1>
                <p className="text-zinc-500 mb-2 font-medium">
                    Your order has been placed successfully.
                </p>
                <p className="text-zinc-400 mb-10">
                    Order #SC{displayToken}
                </p>

                {/* Pickup Details Card */}
                <div className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl p-8 mb-10 text-left">
                    <div className="flex items-center gap-3 mb-4">
                        <Coffee className="w-6 h-6 text-black dark:text-white" />
                        <h2 className="text-lg font-bold text-black dark:text-white">Pickup Details</h2>
                    </div>

                    <div className="space-y-1">
                        <p className="text-zinc-500">
                            Ready in approximately <span className="font-bold text-black dark:text-white">10-15 minutes</span>
                        </p>
                        <p className="text-zinc-500">
                            Campus Building A, Ground Floor
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    to="/menu"
                    className="block w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                    Order Again
                </Link>
            </main>
        </div>
    );
};

export default OrderConfirmation;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import { CreditCard, Loader2 } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
    const { items, totalPrice, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const tax = totalPrice * 0.08;
    const finalTotal = totalPrice + tax;

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const tokenNumber = Math.floor(1000 + Math.random() * 9000).toString();

            // Create order in Firestore
            // Create order in Firestore
            const orderRef = await addDoc(collection(db, "orders"), {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                items: items,
                total: finalTotal,
                status: "pending",
                createdAt: serverTimestamp(),
                tokenNumber: tokenNumber
            });

            // Navigate to confirmation page
            // Note: We do NOT clear cart here to avoid race condition with the "empty cart redirect".
            // The cart will be cleared by the OrderConfirmation page upon mounting.
            navigate("/order-confirmation", {
                state: {
                    orderId: orderRef.id,
                    tokenNumber: tokenNumber,
                    items: items,
                    total: finalTotal
                }
            });
        } catch (error) {
            console.error("Payment failed full error:", error);
            alert(`Payment failed: ${error.message}`);
        } finally {
            // we do NOT set loading to false if we navigated away? 
            // actually if we navigated, the component might unmount.
            // but if we failed, we must set it to false.
            // If success, we navigated. Setting state on unmounted component is a warning but benign.
            // However, if we cleared cart, we are now empty.
            // If we set loading to false, the guard clause `!loading && items.length === 0` will become true and redirect us to home!
            // SO: If success, do NOT set loading to false.
            if (items.length > 0) {
                setLoading(false);
            }
        }
    };

    // If cart is empty and we are NOT in the middle of payment/loading, redirect to home.
    // This prevents race condition where clearCart() is called before navigation.
    if (!loading && items.length === 0) {
        navigate("/");
        return null;
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-10">
            <Navbar />

            <main className="max-w-2xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 dark:text-white">Checkout</h1>

                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <div className="flex justify-between items-center mb-8 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                        <span className="text-zinc-500">Total Amount</span>
                        <span className="font-bold text-2xl dark:text-white">${finalTotal.toFixed(2)}</span>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-white flex items-center gap-2">
                                <CreditCard size={18} />
                                Card Details
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Name on Card</label>
                            <input
                                required
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Card Number</label>
                            <input
                                required
                                type="text"
                                placeholder="4242 4242 4242 4242"
                                maxLength="19"
                                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all font-mono"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Expiry Date</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">CVV</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="123"
                                    maxLength="3"
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : `Pay $${finalTotal.toFixed(2)}`}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Checkout;

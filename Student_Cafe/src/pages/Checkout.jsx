import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import { CreditCard, Loader2 } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { logger } from "../lib/logger";
import { useRateLimit } from "../hooks/useRateLimit";

const Checkout = () => {
    const { items, totalPrice, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Protection: Warn user if they try to refresh during payment
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (loading) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [loading]);

    const tax = totalPrice * 0.08;
    const finalTotal = totalPrice + tax;

    const checkRateLimit = useRateLimit("checkout_pay", 10000); // 10 seconds cooldown

    const handlePayment = async (e) => {
        e.preventDefault();

        try {
            checkRateLimit();
        } catch (error) {
            alert(error.message);
            return;
        }

        setLoading(true);

        // Check 1: Network Connectivity
        if (!navigator.onLine) {
            setLoading(false);
            alert("No internet connection. Please check your network and try again.");
            return;
        }

        // Check 2: Payload Validation (Zero Compromise)
        if (!currentUser?.uid || items.length === 0 || finalTotal <= 0) {
            setLoading(false);
            alert("Order validation failed. Please refresh and try again.");
            return;
        }

        try {
            // STEP 1: Verify Prices with "Source of Truth" (Database)
            // We do NOT trust the client-side cart prices.
            const verifiedItems = await Promise.all(
                items.map(async (cartItem) => {
                    const { doc, getDoc } = await import("firebase/firestore");
                    const productSnap = await getDoc(doc(db, "products", cartItem.id));

                    if (!productSnap.exists()) {
                        throw new Error(`Product ${cartItem.name} no longer exists.`);
                    }

                    const realData = productSnap.data();
                    // Return the item with the REAL price from DB
                    return {
                        id: cartItem.id,
                        name: realData.name,
                        price: Number(realData.price),
                        quantity: Math.max(1, Number(cartItem.quantity)) // Force positive quantity
                    };
                })
            );

            // STEP 2: Recalculate Total with Verified Data
            const verifiedSubtotal = verifiedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const verifiedTax = verifiedSubtotal * 0.08;
            const verifiedTotal = Number((verifiedSubtotal + verifiedTax).toFixed(2));

            // Sanity Check: If the hacked local total differs significantly, we technically proceed with the REAL total.
            // Or we could alert the user. Proceeding with real total is smoother (auto-fix).

            const tokenNumber = Math.floor(1000 + Math.random() * 9000).toString();

            // Prepare Verified Payload
            const orderPayload = {
                userId: currentUser.uid,
                userEmail: currentUser.email || "unknown",
                items: verifiedItems, // Use the verified list
                total: verifiedTotal, // Use the verified total
                status: "pending",
                createdAt: serverTimestamp(),
                tokenNumber: tokenNumber
            };

            // Create order in Firestore
            const orderRef = await addDoc(collection(db, "orders"), orderPayload);

            // Navigate to confirmation page
            navigate("/order-confirmation", {
                state: {
                    orderId: orderRef.id,
                    tokenNumber: tokenNumber,
                    items: verifiedItems,
                    total: verifiedTotal
                }
            });
        } catch (error) {
            logger.error("PAYMENT", "Payment transaction failed.", error);
            alert(`Payment failed: ${error.message}`);
        } finally {
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
                                maxLength={100}
                                pattern=".*[a-zA-Z]+.*"
                                title="Name must contain at least one letter"
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
                                onChange={(e) => {
                                    // STRICT VALIDATION: Only numbers allowed
                                    const val = e.target.value.replace(/\D/g, '');
                                    // Add spaces every 4 digits for UX
                                    e.target.value = val.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                                }}
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
                                    onChange={(e) => {
                                        // Auto-format MM/YY
                                        let v = e.target.value.replace(/\D/g, '');
                                        if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
                                        e.target.value = v;
                                    }}
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">CVV</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="123"
                                    maxLength={3}
                                    pattern="\d{3}"
                                    onChange={(e) => {
                                        // strict numbers only
                                        e.target.value = e.target.value.replace(/\D/g, '');
                                    }}
                                    title="3-digit CVV"
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

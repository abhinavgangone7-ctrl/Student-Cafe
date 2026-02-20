import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/layout/Navbar";
import { useCart } from "../context/CartContext";
import { SeedButton } from "../features/menu/SeedButton";
import { Loader2, Plus, Minus } from "lucide-react";
import { logger } from "../lib/logger";

const categories = ["All", "Coffee", "Tea", "Food"];

const Menu = () => {
    // 1. Data State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. UI State
    const [category, setCategory] = useState("All");

    // 3. Cart State (for the +/- buttons)
    const { addToCart, items, updateQuantity } = useCart();

    // --- DATA FETCHING (With Cache) ---
    const fetchProducts = async (retryCount = 0) => {
        setLoading(true);
        setError(null);

        // a. Cache Setup
        // We save the menu to LocalStorage to make the page load INSTANTLY next time.
        const CACHE_KEY = "menu_cache_v1";
        const CACHE_DURATION = 60 * 60 * 1000; // 1 Hour

        try {
            // b. Check Cache
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                // Is it fresh?
                if (Date.now() - timestamp < CACHE_DURATION) {
                    logger.info("DATA", "Loaded menu from cache.");
                    setProducts(data);
                    setLoading(false);
                    return; // DONE! No network request needed.
                }
            }
        } catch (e) {
            // Cache failed? Just ignore it and fetch normally.
        }

        try {
            // c. Network Request (If cache missed/expired)
            const q = query(collection(db, "products"));
            const snapshot = await getDocs(q);
            let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // d. Validation (Safety Check)
            // Ensure we didn't receive "junk" data.
            const validData = data.filter(item => {
                return item.id && item.name && typeof item.price === 'number';
            });

            if (data.length > 0 && validData.length === 0) {
                throw new Error("Critical Data Corruption Detected");
            }

            setProducts(validData);

            // e. Save to Cache for next time
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
            } catch (e) {
                // Storage full? Ignore.
            }

        } catch (error) {
            logger.error("DATA", "Failed to fetch menu products.", error);
            setError("Data integrity check failed. Please contact support.");
        } finally {
            setLoading(false);
        }
    };

    // Load data on first render
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter Logic: Show keys based on selected category
    const filteredProducts = category === "All"
        ? products
        : products.filter(p => p.category === category);

    // Helper: Find how many of a specific item are in the cart
    const getCartQuantity = (id) => {
        const item = items.find(i => i.id === id);
        return item ? item.quantity : 0;
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-20">
            <Navbar />

            <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Our Menu</h1>
                        <p className="text-zinc-400">Freshly prepared, served daily.</p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${category === cat
                                    ? "bg-amber-500 text-black"
                                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* State: Error */}
                {error ? (
                    <div className="text-center py-20 border border-red-900/50 bg-red-900/10 rounded-2xl">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => fetchProducts()}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : loading ? (
                    // State: Loading
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin w-8 h-8 text-amber-500" />
                    </div>
                ) : products.length === 0 ? (
                    // State: Empty / Dev Mode Seeder
                    <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                        <p className="text-zinc-400 mb-4">No menu items found.</p>
                        <SeedButton onComplete={fetchProducts} />
                    </div>
                ) : (
                    // State: Success (Show Grid)
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const quantity = getCartQuantity(product.id);
                            return (
                                <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-colors">
                                    {/* Image */}
                                    <div className="aspect-[4/3] bg-zinc-800 relative">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs font-bold uppercase tracking-wider text-white">
                                            {product.category}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                                            <span className="text-amber-500 font-mono font-bold">${product.price.toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 h-10">
                                            {product.description}
                                        </p>

                                        {/* Interaction: Add vs Update Quantity */}
                                        {quantity > 0 ? (
                                            <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-700 transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="font-bold w-6 text-center">{quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(product.id, quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-black hover:bg-zinc-200 transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-full py-2 bg-white text-black font-semibold rounded-lg hover:bg-amber-500 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} /> Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Menu;

// React hooks for state and optimization (useCallback, useMemo).
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

// Create the Cart Context (the "Global Radio Station" for cart data).
const CartContext = createContext();

// Custom hook to let components use the cart.
export const useCart = () => useContext(CartContext);

// Safe Storage Helper
// Why: Accessing 'localStorage' can crash the app if cookies are disabled/blocked or storage is full.
// This wrapper quietly fails instead of breaking the app.
const safeStorage = {
    getItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn("LocalStorage access failed (Read):", e);
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn("LocalStorage access failed (Write). Using memory fallback:", e);
        }
    }
};

import { useAuth } from "./AuthContext";

export const CartProvider = ({ children }) => {
    const { currentUser } = useAuth(); // Listen to Auth State to handle user-specific actions.

    // Initialize cart state.
    // We try to read from localStorage first so the cart persists across refreshes.
    const [items, setItems] = useState(() => {
        const saved = safeStorage.getItem("cart");
        try {
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : []; // Strictly enforce Array type to prevent .reduce() crashes
        } catch (e) {
            return [];
        }
    });

    // Valid state for the cart UI sidebar (open/closed).
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Effect: Whenever 'items' changes, save it to localStorage.
    useEffect(() => {
        safeStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    // SECURITY FIX: Clear cart when user logs out.
    // Why: We don't want the next user on this computer to see the previous user's cart.
    useEffect(() => {
        if (!currentUser) {
            setItems([]); // Clear state
            safeStorage.setItem("cart", JSON.stringify([])); // Clear storage
        }
    }, [currentUser]);

    // Function: Add item to cart.
    // 'useCallback' ensures this function checks equality strictly and doesn't trigger unnecessary re-renders.
    const addToCart = useCallback((product) => {
        setItems((prev) => {
            // Check if item already exists in cart.
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                // If yes, just increase quantity (don't add a duplicate row).
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // If no, add new item with quantity 1.
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Automatically open the sidebar so user sees "It worked!"
    }, []);

    // Function: Remove item completely from cart.
    const removeFromCart = useCallback((id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    // Function: Update specific quantity (e.g., clicking "+" or "-").
    const updateQuantity = useCallback((id, quantity) => {
        // If quantity drops below 1, remove the item entirely.
        if (quantity < 1) {
            setItems((prev) => prev.filter((item) => item.id !== id));
            return;
        }
        // Otherwise update the number.
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    }, []);

    // Helpers to manage cart visibility and content.
    const clearCart = useCallback(() => setItems([]), []);
    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);

    // Derived State (calculated on the fly, not stored in state).
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Memoize the value object.
    // Why: Prevents the entire app from re-rendering just because this object was re-created in memory.
    const value = useMemo(() => ({
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        openCart,
        closeCart
    }), [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, openCart, closeCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Open cart when adding item
    }, []);

    const removeFromCart = useCallback((id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id, quantity) => {
        if (quantity < 1) {
            setItems((prev) => prev.filter((item) => item.id !== id));
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    }, []);

    const clearCart = useCallback(() => setItems([]), []);
    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

import { useCart } from "../../context/CartContext";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartSidebar = () => {
    const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart();
    const navigate = useNavigate();
    const tax = totalPrice * 0.08;
    const finalTotal = totalPrice + tax;

    const handleCheckout = () => {
        closeCart();
        navigate("/checkout");
    };

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-amber-500" />
                        Your Order
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag size={48} className="mx-auto text-zinc-800 mb-4" />
                            <p className="text-zinc-500">Your cart is empty.</p>
                            <button onClick={closeCart} className="mt-4 text-amber-500 font-medium hover:underline">
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="bg-zinc-900 rounded-lg p-3 flex gap-3 border border-zinc-800">
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md bg-zinc-800"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                                        <span className="text-amber-500 font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center bg-zinc-800 rounded">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-zinc-700 rounded transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-zinc-700 rounded transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-zinc-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 bg-zinc-900 border-t border-zinc-800 space-y-3">
                        <div className="space-y-1 text-sm text-zinc-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (8%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-zinc-800">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            Checkout
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;

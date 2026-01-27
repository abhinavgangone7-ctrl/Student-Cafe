import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

const Cart = () => {
    const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
    const navigate = useNavigate();

    const tax = totalPrice * 0.08;
    const finalTotal = totalPrice + tax;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 text-center py-20">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
                    <p className="text-zinc-500 mb-8">Looks like you haven't added anything yet.</p>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
                    >
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-20 pb-10">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-2 dark:text-white">Your Order</h1>
                <p className="text-zinc-500 mb-8">{items.length} item{items.length !== 1 && 's'} in your order</p>

                <div className="space-y-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-zinc-900 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-zinc-200 dark:border-zinc-800"
                        >
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-xl"
                            />

                            <div className="flex-1">
                                <h3 className="font-bold text-lg dark:text-white">{item.name}</h3>
                                <p className="text-zinc-500 text-sm">${item.price.toFixed(2)} each</p>
                            </div>

                            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors"
                                >
                                    <Minus size={16} className="dark:text-white" />
                                </button>
                                <span className="text-sm font-medium w-4 text-center dark:text-white">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-colors"
                                >
                                    <Plus size={16} className="dark:text-white" />
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>

                            <div className="text-right font-bold w-20 dark:text-white">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4 dark:text-white">Order Summary</h3>

                    <div className="space-y-2 text-zinc-600 dark:text-zinc-400 mb-6">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Tax (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center font-bold text-xl pt-4 border-t border-zinc-300 dark:border-zinc-700 mb-8 dark:text-white">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={() => navigate("/checkout")}
                        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        Proceed to Pay
                        <ArrowRight size={20} />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Cart;

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import { Download, CheckCircle, Clock, AlertTriangle, RefreshCw, XCircle } from "lucide-react";
import { logger } from "../lib/logger";

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("pending"); // 'pending', 'completed', 'all'
    const [backupLoading, setBackupLoading] = useState(false);

    // KITCHEN DISPLAY SYSTEM: Real-time Listener
    useEffect(() => {
        // Query recent orders
        const q = query(
            collection(db, "orders"),
            orderBy("createdAt", "desc"),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const liveData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Handle Timestamp for display
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setOrders(liveData);
            setLoading(false);
        }, (error) => {
            logger.error("ADMIN", "Failed to subscribe to live orders.", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: newStatus });
            logger.info("ADMIN", `Order ${orderId} updated to ${newStatus}`);
        } catch (error) {
            logger.error("ADMIN", "Failed to update order status.", error);
            if (error.code === 'permission-denied') {
                alert("Permission Denied: You cannot edit orders. Check Firestore Rules.");
            } else {
                alert(`Action failed: ${error.message}`);
            }
        }
    };

    const handleBackup = async () => {
        setBackupLoading(true);
        try {
            const { getDocs, collection } = await import("firebase/firestore"); // Dynamic import
            const snapshot = await getDocs(collection(db, "products"));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `menu_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);

            alert(`Backup Complete! Saved ${data.length} items.`);
        } catch (error) {
            logger.error("SYSTEM", "Backup failed", error);
            alert("Backup failed.");
        } finally {
            setBackupLoading(false);
        }
    };

    // Filter Logic
    const filteredOrders = orders.filter(o =>
        filter === 'all' ? true : o.status === filter
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-12">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Clock className="text-amber-500" />
                            Kitchen Dashboard
                        </h1>
                        <p className="text-zinc-400 text-sm mt-1">Live Feed • {orders.length} Orders in system</p>
                    </div>

                    <button
                        onClick={handleBackup}
                        disabled={backupLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors border border-zinc-700"
                    >
                        <Download size={16} />
                        {backupLoading ? "Saving..." : "Backup Menu Data"}
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1 rounded-xl w-fit border border-zinc-800">
                    {['pending', 'completed', 'all'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f
                                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Orders Grid */}
                {loading ? (
                    <div className="text-center py-20 text-zinc-500 animate-pulse">Connecting to Live Feed...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800 border-dashed">
                                <p className="text-zinc-500">No {filter} orders found.</p>
                            </div>
                        )}

                        {filteredOrders.map(order => (
                            <div key={order.id} className={`
                                relative overflow-hidden rounded-2xl p-6 border transition-all
                                ${order.status === 'pending'
                                    ? "bg-zinc-900 border-amber-500/30 shadow-[0_0_30px_-10px_rgba(245,158,11,0.1)]"
                                    : "bg-zinc-900/50 border-zinc-800 opacity-75 grayscale hover:grayscale-0"}
                            `}>
                                {/* Card Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-zinc-500">#{order.tokenNumber}</span>
                                        <h3 className="font-bold text-lg text-white">
                                            {order.userEmail.split('@')[0]}
                                        </h3>
                                        <p className="text-xs text-zinc-400">
                                            {order.createdAt.toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${order.status === 'pending' ? "bg-amber-500 text-black" : "bg-green-500/20 text-green-500"
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                {/* Items List */}
                                <div className="space-y-3 mb-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-zinc-300">
                                                <span className="text-amber-500 font-bold mr-2">{item.quantity}x</span>
                                                {item.name}
                                            </span>
                                            <span className="text-zinc-500">${item.price}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-zinc-800 pt-3 mt-3 flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${order.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                {order.status === 'pending' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => updateStatus(order.id, 'cancelled')}
                                            className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-red-900/20 hover:text-red-500 font-semibold text-sm transition-colors border border-transparent hover:border-red-500/30"
                                        >
                                            Refund
                                        </button>
                                        <button
                                            onClick={() => updateStatus(order.id, 'completed')}
                                            className="px-4 py-3 rounded-xl bg-white text-black hover:bg-green-400 hover:scale-[1.02] active:scale-95 font-bold text-sm transition-all shadow-lg shadow-white/10"
                                        >
                                            Complete Order
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

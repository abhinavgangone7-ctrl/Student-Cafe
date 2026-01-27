import { collection, writeBatch, doc, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { products } from "../../data/products";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { logger } from "../../lib/logger";

export const SeedButton = ({ onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("idle"); // idle, success, error

    const { currentUser } = useAuth(); // Get current user

    const handleSeed = async () => {
        if (!currentUser) {
            alert("Security Alert: You must be logged in to perform administration tasks.");
            return;
        }

        setLoading(true);
        try {
            const batch = writeBatch(db);

            // 1. Delete existing products to avoid duplicates and clean up broken data
            const snapshot = await getDocs(collection(db, "products"));
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            // 2. Add new products
            products.forEach((product) => {
                // Create a ref with auto-generated ID
                const docRef = doc(collection(db, "products"));
                batch.set(docRef, product);
            });

            await batch.commit();
            setStatus("success");
            if (onComplete) onComplete();
        } catch (error) {
            logger.error("SYSTEM", "Failed to seed database.", error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    if (status === "success") {
        return <div className="text-green-500 flex items-center gap-2"><CheckCircle size={16} /> Data loaded</div>
    }

    if (status === "error") {
        return (
            <div className="text-red-500 flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                <span>Failed</span>
                <button
                    onClick={() => setStatus("idle")}
                    className="underline hover:text-red-400"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleSeed}
            disabled={loading}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
        >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Seed Database"}
        </button>
    );
};

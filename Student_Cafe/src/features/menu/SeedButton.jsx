import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { products } from "../../data/products";
import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export const SeedButton = ({ onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("idle"); // idle, success, error

    const handleSeed = async () => {
        setLoading(true);
        try {
            const batch = writeBatch(db);

            products.forEach((product) => {
                // Create a ref with auto-generated ID
                const docRef = doc(collection(db, "products"));
                batch.set(docRef, product);
            });

            await batch.commit();
            setStatus("success");
            if (onComplete) onComplete();
        } catch (error) {
            console.error("Error seeding data:", error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    if (status === "success") {
        return <div className="text-green-500 flex items-center gap-2"><CheckCircle size={16} /> Data loaded</div>
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

// Firestore helpers to write multiple docs at once (batch).
import { collection, writeBatch, doc, getDocs } from "firebase/firestore";
// Database instance.
import { db } from "../../lib/firebase";
// The hardcoded list of products we want to put in the DB.
import { products } from "../../data/products";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { logger } from "../../lib/logger";

/**
 * SeedButton Component
 * 
 * What it does:
 * A developer tool to "Reset" the database products.
 * 
 * Why:
 * Entering 50 products manually in Firestore console is boring. 
 * This button deletes old products and uploads the fresh list from `src/data/products.js`.
 */
export const SeedButton = ({ onComplete }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("idle"); // idle | success | error

    const { currentUser } = useAuth(); // Get current user

    const handleSeed = async () => {
        // Double check: Only logged in users (and visually usually only Admins) should see this.
        if (!currentUser) {
            alert("Security Alert: You must be logged in to perform administration tasks.");
            return;
        }

        setLoading(true);
        try {
            // A "Batch" allows us to do many database operations as ONE big request.
            // If one fails, they all fail. It's safer and faster.
            const batch = writeBatch(db);

            // 1. GET all existing products
            const snapshot = await getDocs(collection(db, "products"));

            // 2. QUEUE them for deletion
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            // 3. QUEUE new products for creation
            const productsCollection = collection(db, "products");
            products.forEach((product) => {
                // Create a ref with auto-generated ID (e.g., 'ab12cd34...')
                const newDocRef = doc(productsCollection);
                batch.set(newDocRef, product);
            });

            // 4. COMMIT the batch (Execute all instructions now)
            await batch.commit();

            setStatus("success");
            if (onComplete) onComplete(); // Tell parent component we are done
        } catch (error) {
            logger.error("SYSTEM", "Failed to seed database.", error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    // UI: Success State
    if (status === "success") {
        return <div className="text-green-500 flex items-center gap-2"><CheckCircle size={16} /> Data loaded</div>
    }

    // UI: Error State
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

    // UI: Default Button
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

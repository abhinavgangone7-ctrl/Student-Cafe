import { useState, useEffect } from "react";
import { X } from "lucide-react";

/**
 * StoragePolicyBanner Component
 * 
 * What it is:
 * A legally required banner that informs users we use local storage.
 * (Renamed from CookieConsent to avoid strict ad-blocker filters).
 */
const StoragePolicyBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasConsent = localStorage.getItem("cookie_consent");
        if (!hasConsent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[100] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-5 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    🍪 Cookie & Storage Policy
                </h3>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                We use local browser storage (like Cookies and IndexedDB) to keep you securely logged in and to remember the items in your cart. By using Student Cafe, you consent to our use of these necessary storage tokens.
            </p>

            <div className="flex gap-3">
                <button
                    onClick={handleAccept}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black py-2 px-4 rounded-xl text-sm font-bold transition-colors"
                >
                    Got it, thanks!
                </button>
            </div>
        </div>
    );
};

export default StoragePolicyBanner;

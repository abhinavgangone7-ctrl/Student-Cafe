import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

/**
 * FeedbackWidget Component
 * 
 * What it is:
 * The floating button in the bottom-right corner.
 * 
 * Behavior:
 * It stays hidden on most pages. It ONLY appears on sensitive pages like Checkout.
 */
const FeedbackWidget = () => {
    // State to toggle the modal form (open/closed)
    const [isOpen, setIsOpen] = useState(false);

    // Check current URL to decide if we should show the button.
    const location = useLocation();

    // Logic: Only show feedback on billing related pages (Checkout & Confirmation).
    // Why: We want to catch users exactly when they are most likely to have issues (payment flow).
    const showFeedback = ["/checkout", "/order-confirmation"].includes(location.pathname);

    // If we're not on those pages, don't render anything.
    if (!showFeedback) return null;

    return (
        <>
            {/* The Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-white text-black hover:bg-zinc-200 p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group"
                aria-label="Give Feedback"
            >
                {/* Icon */}
                <MessageSquare className="w-6 h-6" />

                {/* Text Label: Shows on hover (sliding out animation) */}
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap group-hover:pl-2 font-bold text-sm">
                    Feedback
                </span>
            </button>

            {/* The Actual Modal (Lazy Loaded logic inside the component essentially) */}
            <FeedbackModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

export default FeedbackWidget;

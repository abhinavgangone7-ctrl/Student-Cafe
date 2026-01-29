import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

const FeedbackWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Only show feedback on billing related pages
    const showFeedback = ["/checkout", "/order-confirmation"].includes(location.pathname);

    if (!showFeedback) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-white text-black hover:bg-zinc-200 p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group"
                aria-label="Give Feedback"
            >
                <MessageSquare className="w-6 h-6" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap group-hover:pl-2 font-bold text-sm">
                    Feedback
                </span>
            </button>

            <FeedbackModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

export default FeedbackWidget;

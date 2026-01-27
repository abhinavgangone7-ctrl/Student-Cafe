import { useState } from "react";
import { X, Loader2, MessageSquare, ChevronDown } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { useRateLimit } from "../../hooks/useRateLimit";
import { logger } from "../../lib/logger";

const FeedbackModal = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const checkRateLimit = useRateLimit("feedback_submit", 60000); // 1 Minute cooldown - Moved Up

    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            checkRateLimit();
        } catch (error) {
            alert(error.message);
            return;
        }

        setLoading(true);

        if (!navigator.onLine) {
            setLoading(false);
            alert("No internet connection. Please check your network.");
            return;
        }

        try {
            // Sanitize payload (Strip dangerous characters)
            const safeMessage = message.replace(/[<>]/g, "");

            const feedbackPayload = {
                role: role.trim(),
                type: type,
                message: safeMessage.trim(), // Send sanitized version
                userId: currentUser?.uid || "anonymous",
                userEmail: currentUser?.email || "anonymous",
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, "feedback"), feedbackPayload);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setRole("");
                setType("");
                setMessage("");
                onClose();
            }, 2000);
        } catch (error) {
            logger.error("FEEDBACK", "Failed to submit feedback.", error);
            alert("Failed to submit feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 sm:p-6 pointer-events-none">
            {/* Backdrop - reduced opacity closer to 'widget' feel but still modal */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 pointer-events-auto mr-0 mb-0 sm:mr-4 sm:mb-4">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-900 bg-zinc-950 shrink-0">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        Share Feedback
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto bg-zinc-950">
                    {showSuccess ? (
                        <div className="py-8 text-center animate-in fade-in duration-300">
                            <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-zinc-500 text-sm">Your feedback has been received.</p>
                        </div>
                    ) : (
                        <form id="feedback-form" onSubmit={handleSubmit} className="space-y-5">
                            {/* Who are you? */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                                    Who are you?
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. Student, Developer..."
                                    maxLength={50} // Prevent long strings
                                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all text-sm hover:border-zinc-700"
                                />
                            </div>

                            {/* What's this about? */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                                    Topic
                                </label>
                                <div className="relative">
                                    <select
                                        required
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none cursor-pointer text-sm hover:border-zinc-700 ${!type ? 'text-zinc-500' : 'text-white'}`}
                                    >
                                        <option value="" disabled>Select a topic...</option>
                                        <option value="Feature Request">Feature Request</option>
                                        <option value="Bug Report">Bug Report</option>
                                        <option value="General Feedback">General Feedback</option>
                                        <option value="Order Issue">Order Issue</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                        <ChevronDown size={14} />
                                    </div>
                                </div>
                            </div>

                            {/* Your Feedback */}
                            <div>
                                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                                    Message
                                </label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what you think..."
                                    rows={4}
                                    maxLength={500} // Prevent long strings
                                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all resize-none text-sm hover:border-zinc-700"
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer Actions */}
                {!showSuccess && (
                    <div className="p-4 border-t border-zinc-900 shrink-0 bg-zinc-950">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium rounded-xl transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                form="feedback-form"
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-white/5"
                            >
                                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Submit"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;

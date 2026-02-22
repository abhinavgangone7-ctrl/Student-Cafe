import { X } from "lucide-react";

/**
 * PrivacyPolicyModal Component
 * 
 * What it is:
 * A modal that displays the legally required Privacy Policy.
 * It explains what data we collect, why, and user rights.
 */
const PrivacyPolicyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-900 bg-zinc-950 shrink-0">
                    <h2 className="text-lg font-bold text-white">
                        Privacy Policy
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-zinc-900 rounded-full transition-colors text-zinc-500 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area (Scrollable) */}
                <div className="p-6 overflow-y-auto bg-zinc-950 text-zinc-300 text-sm space-y-6 flex-1 custom-scrollbar">

                    <div>
                        <h3 className="text-white font-bold mb-2">1. Information We Collect</h3>
                        <p className="leading-relaxed text-zinc-400">
                            We collect information to provide better services to our users. This includes:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                            <li><strong>Account Data:</strong> Your email address, name, and profile picture (provided via Google Authentication).</li>
                            <li><strong>Order History:</strong> Details of the items you purchase and checkout timestamps.</li>
                            <li><strong>Feedback:</strong> Any messages or feedback submitted through our support forms.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-2">2. How We Use Your Information</h3>
                        <p className="leading-relaxed text-zinc-400">
                            The information we collect is used solely to operate the Student Cafe application:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                            <li>To authenticate you and maintain your session securely.</li>
                            <li>To process and fulfill your cafe orders.</li>
                            <li>To respond to your feedback or feature requests.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-2">3. Data Sharing and Third Parties</h3>
                        <p className="leading-relaxed text-zinc-400">
                            We do not sell your personal data. We share data only with essential infrastructure providers required to run the app:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
                            <li><strong>Google Firebase:</strong> Acts as our database and authentication provider. Your data is stored securely on Google's servers.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-2">4. Local Storage and Cookies</h3>
                        <p className="leading-relaxed text-zinc-400">
                            We use local browser storage (such as `localStorage` and IndexedDB) to save your active shopping cart, cache menu items for faster loading, and securely store your authentication tokens. You consent to this necessary storage by using the application.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-2">5. Your Data Rights (Deletion & Export)</h3>
                        <p className="leading-relaxed text-zinc-400">
                            You have the right to request a copy of your data or request complete deletion of your account and associated order history. To exercise these rights (under GDPR/CCPA), please contact the application administrator or use the profile settings panel (if currently available).
                        </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-900">
                        <p className="text-xs text-zinc-500">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                            Note: This is a practice application. Payment gateways are simulated and no real financial transactions occur.
                        </p>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-zinc-900 shrink-0 bg-zinc-950 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl transition-colors text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyModal;

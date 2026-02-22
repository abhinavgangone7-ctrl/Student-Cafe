import { useLocation } from "react-router-dom";
// Shared UI Features that live on every page.
import CartSidebar from "../features/CartSidebar";
import FeedbackWidget from "../features/FeedbackWidget";
import CookieConsent from "../features/CookieConsent"; // <-- COMPLIANCE REQUIREMENT

/**
 * MainLayout Component
 * 
 * What it is:
 * The "Frame" of our application. It wraps every page.
 * 
 * What it contains:
 * 1. The fancy animated background (particles, gradient, image).
 * 2. The global widgets (Shopping Cart sidebar, Feedback button).
 * 3. The actual page content (children).
 */
const MainLayout = ({ children }) => {
    const location = useLocation();

    return (
        // Main Container: distinct font settings and text colors.
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-amber-500/30">

            {/* --- ANIMATED BACKGROUND LAYER --- */}
            {/* 'pointer-events-none' ensures clicks pass THROUGH this layer to the buttons below. */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* 1. The Cafe Image (Blurred) */}
                <div
                    className="absolute inset-0 w-full h-full bg-[url('/cafe-bg.png')] bg-cover bg-center opacity-40 blur-[2px]"
                />

                {/* 2. Dark Gradient Overlay (Makes text readable on top of image) */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-900/60" />

                {/* 3. Floating Particles (Dust Motes) */}
                {/* Pure CSS animations defined in tailwind.config or app.css (animate-float) */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-amber-500 rounded-full animate-float opacity-50 blur-[1px]" />
                    <div className="absolute top-[50%] right-[20%] w-1 h-1 bg-white rounded-full animate-float opacity-30 blur-[1px] delay-1000" />
                    <div className="absolute bottom-[30%] left-[40%] w-3 h-3 bg-amber-200 rounded-full animate-float opacity-20 blur-[2px] delay-2000" />
                </div>
            </div>

            {/* --- CONTENT LAYER --- */}
            {/* 'relative z-10' puts this ON TOP of the background. */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {children} {/* This is where the page content (Login, Menu, etc.) goes. */}
            </div>

            {/* --- GLOBAL WIDGETS --- */}
            {/* These are always available, hidden off-screen until opened. */}
            <CartSidebar />
            <FeedbackWidget />

            {/* Global Legal Requirements */}
            <CookieConsent />
        </div>
    );
};

export default MainLayout;

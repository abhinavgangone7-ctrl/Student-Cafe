import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CartSidebar from "../features/CartSidebar";

const MainLayout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-amber-500/30">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                {/* The Image Layer */}
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full bg-[url('/cafe-bg.png')] bg-cover bg-center opacity-40 blur-[2px]"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-900/60" />

                {/* Floating Particles/Dust Motes */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-amber-500 rounded-full animate-float opacity-50 blur-[1px]" />
                    <div className="absolute top-[50%] right-[20%] w-1 h-1 bg-white rounded-full animate-float opacity-30 blur-[1px] delay-1000" />
                    <div className="absolute bottom-[30%] left-[40%] w-3 h-3 bg-amber-200 rounded-full animate-float opacity-20 blur-[2px] delay-2000" />
                </div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {children}
            </div>

            <CartSidebar />
        </div>
    );
};

export default MainLayout;

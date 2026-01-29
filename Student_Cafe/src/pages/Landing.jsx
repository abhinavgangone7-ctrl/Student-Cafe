import { Link } from "react-router-dom";
import { ArrowRight, Coffee, Wifi, BookOpen } from "lucide-react";
import Navbar from "../components/layout/Navbar";

const Landing = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-amber-500/30">
            <Navbar />
            {/* HERO SECTION */}
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                    Student <span className="text-amber-500">Café</span>
                </h1>
                <p className="text-xl text-zinc-400 max-w-xl mx-auto mb-10">
                    The ultimate spot for students to refuel, study, and connect.
                    Premium coffee, fast wifi, and good vibes.
                </p>

                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-amber-500 text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-amber-400 transition-colors"
                >
                    Order Now
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* FEATURES SECTION */}
            <section className="py-20 px-6 border-t border-zinc-800">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                        <Coffee className="w-8 h-8 text-amber-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Artisan Brews</h3>
                        <p className="text-zinc-500">Small batch roasted beans, brewed with precision for the perfect extraction.</p>
                    </div>

                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                        <Wifi className="w-8 h-8 text-amber-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Gigabit Vibes</h3>
                        <p className="text-zinc-500">Blazing fast internet and dedicated quiet zones for deep work.</p>
                    </div>

                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                        <BookOpen className="w-8 h-8 text-amber-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Study Haven</h3>
                        <p className="text-zinc-500">Open late during exam weeks. We keep the lights on and the espresso flowing.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;

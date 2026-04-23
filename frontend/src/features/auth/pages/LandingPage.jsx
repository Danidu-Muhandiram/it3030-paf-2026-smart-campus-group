import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
    return (
        <div className="relative h-screen w-full overflow-hidden font-sans bg-primary flex items-center justify-center">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/landingpage.jpg')" }}
            />
            {/* Reduced blue overlay for better visibility of the background image */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/95 via-[#1E3A8A]/60 to-transparent" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center">

                {/* Logo Section */}
                <div className="mb-10">
                    <span className="text-white text-3xl font-bold tracking-tight uppercase">Apex Campus</span>
                </div>

                {/* Hero Section */}
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
                    Smart Campus <span className="text-white/70 italic">Operations, Simplified</span>
                </h1>

                <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed max-w-2xl mb-10 drop-shadow-sm">
                    Apex Campus brings together booking management, maintenance handling, and resource coordination into one intelligent platform designed to improve efficiency, reduce delays, and enhance campus service delivery.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link
                        to="/login"
                        className="group flex items-center justify-center gap-2 px-10 py-3.5 bg-white text-[#1E3A8A] rounded-xl font-bold text-base hover:bg-white/90 transition-all shadow-xl active:scale-95"
                    >
                        Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        to="/register"
                        className="flex items-center justify-center px-10 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-base hover:bg-white/20 transition-all active:scale-95"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Simple Footer */}
                <footer className="mt-16 text-white/40 text-[10px] font-medium">
                    © 2026 Apex Campus. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

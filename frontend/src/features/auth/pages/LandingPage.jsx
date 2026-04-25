import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
        }
    };

    return (
        <div className="relative h-screen w-full overflow-hidden font-sans bg-primary flex items-center justify-center">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/landingpage.jpg')" }}
            />
            
            {/* Reduced blue overlay for better visibility of the background image */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/95 via-[#1E3A8A]/60 to-transparent z-[1]" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] z-[1]" />
            
            {/* Animated Background Blobs */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-700/40 rounded-full blur-[90px] z-[2]"
                animate={{ 
                    scale: [1, 1.2, 1], 
                    x: [0, 50, 0], 
                    y: [0, -40, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-700/30 rounded-full blur-[110px] z-[2]"
                animate={{ 
                    scale: [1, 1.3, 1], 
                    x: [0, -50, 0], 
                    y: [0, 50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Content Container */}
            <motion.div 
                className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo Section */}
                <motion.div variants={itemVariants} className="mb-10">
                    <span className="text-white text-3xl font-bold tracking-tight uppercase">Apex Campus</span>
                </motion.div>

                {/* Hero Section */}
                <motion.h1 
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight"
                >
                    Smart Campus <span className="text-white/70 italic">Operations, Simplified</span>
                </motion.h1>

                <motion.p 
                    variants={itemVariants}
                    className="text-sm md:text-base text-white/90 font-medium leading-relaxed max-w-2xl mb-10 drop-shadow-sm"
                >
                    Apex Campus brings together booking management, maintenance handling, and resource coordination into one intelligent platform designed to improve efficiency, reduce delays, and enhance campus service delivery.
                </motion.p>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
                </motion.div>

                {/* Simple Footer */}
                <motion.footer 
                    variants={itemVariants}
                    className="mt-16 text-white/40 text-[10px] font-medium"
                >
                    © 2026 Apex Campus. All rights reserved.
                </motion.footer>
            </motion.div>
        </div>
    );
};

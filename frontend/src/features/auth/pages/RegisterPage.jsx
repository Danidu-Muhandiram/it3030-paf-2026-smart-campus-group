import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Settings, CheckCircle2, Building2, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { authService } from '../authService';

export const RegisterPage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-bg-main flex flex-col md:flex-row font-sans">

            {/* Left section */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-primary text-white p-8 lg:p-12 relative overflow-hidden">

                {/* Background effects */}
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-700/60 rounded-full blur-[90px] z-0"
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -40, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-700/50 rounded-full blur-[110px] z-0"
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, 50, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                    className="absolute inset-0 z-[1] opacity-30 mix-blend-overlay"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)',
                        backgroundSize: '24px 24px',
                        maskImage: 'linear-gradient(to bottom, white 60%, transparent 100%)'
                    }}
                ></div>

                <div className="relative z-10 flex flex-col h-full">

                    {/* Top logo & navigation */}
                    <div className="mb-8 w-full flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-100 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            SLIIT Smart Campus
                        </Link>

                        <Link to="/" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center transition-colors shrink-0">
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                    </div>

                    {/* Main text content with stagger animation */}
                    <motion.div
                        className="flex-grow flex flex-col justify-center max-w-lg"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.span variants={itemVariants} className="py-1.5 px-3.5 rounded-full bg-blue-800/40 border border-blue-600/50 text-blue-200 text-[11px] uppercase tracking-wider font-bold mb-6 w-max shadow-[0_0_20px_rgba(37,99,235,0.2)] backdrop-blur-md">
                            Join the Network
                        </motion.span>

                        <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-extrabold mb-6 leading-[1.15] tracking-tight">
                            Streamline your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-400">campus experience</span> today.
                        </motion.h2>

                        <motion.p variants={itemVariants} className="text-blue-100/90 text-[15px] lg:text-base mb-8 leading-relaxed font-light">
                            Join the SLIIT smart campus hub to seamlessly manage facilities, bookings, and operations all in one unified, intelligent platform.
                        </motion.p>

                        {/* Feature list */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <div className="group flex items-start gap-4 text-blue-100 transition-all hover:-translate-y-1 hover:bg-white/5 p-3 -ml-3 rounded-2xl cursor-default border border-transparent hover:border-white/10">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-110 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md flex items-center justify-center border border-blue-500/20 transition-all duration-300 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mt-0.5 text-base group-hover:text-blue-100 transition-colors">Real-time Bookings</h4>
                                    <p className="text-sm text-blue-200/70 mt-1 leading-relaxed">Reserve facilities instantly with our live availability calendar and streamlined interface.</p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-4 text-blue-100 transition-all hover:-translate-y-1 hover:bg-white/5 p-3 -ml-3 rounded-2xl cursor-default border border-transparent hover:border-white/10">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-110 shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-md flex items-center justify-center border border-blue-500/20 transition-all duration-300 shrink-0">
                                    <Settings className="w-5 h-5 text-blue-300 group-hover:text-white transition-colors" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mt-0.5 text-base group-hover:text-blue-100 transition-colors">Instant Operations requests</h4>
                                    <p className="text-sm text-blue-200/70 mt-1 leading-relaxed">Report issues, track maintenance progress, and receive automated status updates.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <div className="mt-auto text-blue-300/60 text-[13px]">
                        © 2026 SLIIT Smart Campus Operations Hub
                    </div>
                </div>
            </div>

            {/* Right section - form */}
            <div className="w-full md:w-1/2 h-full overflow-y-auto flex flex-col justify-start md:justify-center items-center py-6 px-4 md:py-0 relative">

                {/* Mobile header view & navigation */}
                <div className="md:hidden w-full flex items-center justify-between mb-8 px-2 border-b border-gray-100 pb-4">
                    <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-primary flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-white" />
                        </div>
                        Smart Campus
                    </Link>

                    <Link to="/" className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm shrink-0">
                        <ArrowLeft className="w-5 h-5 text-text-muted" />
                    </Link>
                </div>

                <div className="w-full max-w-[400px] my-auto">
                    <div className="mb-4 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-text-main mb-1.5">Create an account</h1>
                        <p className="text-text-muted text-[15px]">
                            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in here</Link>
                        </p>
                    </div>

                    <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="space-y-1 w-full">
                                <label className="text-md font-semibold text-text-muted">First Name</label>
                                <input
                                    type="text"
                                    placeholder="Harsha"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                                />
                            </div>
                            <div className="space-y-1 w-full">
                                <label className="text-md font-semibold text-text-muted">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Fernando"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-md font-semibold text-text-muted">University Email</label>
                            <input
                                type="email"
                                placeholder="idnumber@my.sliit.lk"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="space-y-1 w-full sm:w-1/3">
                                <label className="text-md font-semibold text-text-muted">Role</label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm appearance-none cursor-pointer text-text-main bg-white">
                                        <option value="student">Student</option>
                                        <option value="staff">Staff</option>
                                        <option value="faculty">Faculty</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 w-full sm:w-2/3">
                                <label className="text-md font-semibold text-text-muted">ID Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. IT2612345678"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-md font-semibold text-text-muted">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main"
                            />
                            <p className="text-[12px] text-text-light mt-1.5">Must be at least 8 characters long</p>
                        </div>

                        <div className="flex items-start gap-2.5 pt-2">
                            <div className="flex items-center h-4 mt-0.5">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary cursor-pointer"
                                />
                            </div>
                            <label className="text-md text-text-muted">
                                I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        <button className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-[11px] px-4 rounded-lg mt-4 flex justify-center items-center gap-2 transition-all active:scale-[0.98] shadow-sm hover:shadow-md">
                            Create Account
                            <Rocket className="w-4 h-4" />
                        </button>

                        <div className="relative mt-6 mb-1">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm font-medium">
                                <span className="bg-white px-4 text-text-muted">Or sign up with</span>
                            </div>
                        </div>

                        <button 
                            type="button"
                            aria-label="Sign in with Google"
                            onClick={authService.startGoogleLogin}
                            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-text-main font-semibold py-[11px] px-4 rounded-lg flex justify-center items-center gap-3 transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
                        >
                            <FcGoogle className="w-5 h-5" />
                            Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ArrowLeft, Building2, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-bg-main flex flex-col md:flex-row font-sans">
            {/* Left section */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-primary text-white p-8 lg:p-12 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div
                    className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                        backgroundSize: '20px 20px',
                        maskImage: 'linear-gradient(to bottom, white, transparent)'
                    }}
                ></div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Top logo & navigation */}
                    <div className="mb-8 w-full flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-100 flex items-center gap-2 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            SLIIT Smart Campus
                        </Link>

                        <Link to="/" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 flex items-center justify-center transition-colors shrink-0">
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                    </div>

                    {/* Main text content */}
                    <div className="flex-grow flex flex-col justify-center max-w-lg">
                        <span className="py-1 px-3 rounded-full bg-blue-800/60 border border-blue-700/50 text-blue-200 text-xs font-semibold uppercase mb-4 w-max">
                            Welcome Back
                        </span>

                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                            Access your smart campus dashboard.
                        </h2>

                        <p className="text-blue-100/90 text-base lg:text-lg mb-8">
                            Log in to manage your facilities, view upcoming reservations, and stay connected with campus operations.
                        </p>
                    </div>

                    <div className="mt-10 text-blue-300/60 text-sm">
                        © 2026 SLIIT Smart Campus Operations Hub
                    </div>
                </div>
            </div>

            {/* Right section - form */}
            <div className="w-full md:w-1/2 flex flex-col justify-start md:justify-center items-center py-8 px-4 sm:p-8 relative">
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

                <div className="w-full max-w-[400px]">
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-text-main mb-2">Log in to your account</h1>
                        <p className="text-text-muted text-md">
                            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up here</Link>
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-1.5">
                            <label className="text-md font-semibold text-text-muted">University Email</label>
                            <input
                                type="email"
                                placeholder="idnumber@my.sliit.lk"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main transition-all"
                            />
                        </div>

                        <div className="space-y-1.5 relative">
                            <div className="flex justify-between items-center">
                                <label className="text-md font-semibold text-text-muted">Password</label>
                                <a href="#" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-text-main pr-10 transition-all focus:shadow-[0_0_0_4px_rgba(25,118,210,0.1)]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 pt-2">
                            <div className="flex items-center h-4 mt-0.5">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary cursor-pointer transition-colors"
                                />
                            </div>
                            <label htmlFor="remember-me" className="text-md text-text-muted cursor-pointer select-none">
                                Remember me for 30 days
                            </label>
                        </div>

                        <button className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-lg mt-8 flex justify-center items-center gap-2 transition-all active:scale-[0.98] shadow-sm hover:shadow-md">
                            Log In
                            <LogIn className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

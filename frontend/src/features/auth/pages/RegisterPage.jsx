import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Settings, CheckCircle2, Building2, ArrowLeft } from 'lucide-react';

export const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-bg-main flex flex-col md:flex-row font-sans">

            {/* Left section */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-primary text-white p-8 lg:p-12 relative overflow-hidden">

                {/* Background effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div
                    className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                        backgroundSize: '20px 20px',
                        maskImage: 'linear-gradient(to bottom, white, transparent)' // Fades out the pattern at the bottom
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

                    {/* Main text content */}
                    <div className="flex-grow flex flex-col justify-center max-w-lg">
                        <span className="py-1 px-3 rounded-full bg-blue-800/60 border border-blue-700/50 text-blue-200 text-xs font-semibold uppercase mb-4 w-max">
                            Join the Network
                        </span>

                        <h2 className="text-3xl lg:text-4xl font-bold mb-10 leading-tight">
                            Streamline your campus experience today.
                        </h2>

                        <p className="text-blue-100/90 text-base lg:text-lg mb-8">
                            Join the SLIIT smart campus hub to seamlessly manage facilities, bookings, and operations all in one unified platform.
                        </p>

                        {/* Feature list */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 text-blue-100 hover:translate-x-2 transition-transform">
                                <div className="w-10 h-10 rounded-xl bg-blue-800/40 backdrop-blur-md flex items-center justify-center border border-blue-700/50">
                                    <CheckCircle2 className="w-5 h-5 text-blue-300" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mt-1">Real-time Bookings</h4>
                                    <p className="text-sm text-blue-200/80">Reserve facilities instantly with our live availability calendar.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 text-blue-100 hover:translate-x-2 transition-transform">
                                <div className="w-10 h-10 rounded-xl bg-blue-800/40 backdrop-blur-md flex items-center justify-center border border-blue-700/50">
                                    <Settings className="w-5 h-5 text-blue-300" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white mt-1">Instant Operations requests</h4>
                                    <p className="text-sm text-blue-200/80">Report issues and track maintenance progress automatically.</p>
                                </div>
                            </div>
                        </div>
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
                    <div className="mb-6 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-text-main mb-2">Create an account</h1>
                        <p className="text-text-muted text-md">
                            Already have an account? <a href="#" className="text-primary font-medium hover:underline">Log in here</a>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

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

                        <button className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-lg mt-6 flex justify-center items-center gap-2 transition-colors">
                            Create Account
                            <Rocket className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

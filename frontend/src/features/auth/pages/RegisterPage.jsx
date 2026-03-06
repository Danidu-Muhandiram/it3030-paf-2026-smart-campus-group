import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Settings, CheckCircle2, Building2 } from 'lucide-react';

export const RegisterPage = () => {
    return (
        <div className="h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">

            {/* Left section */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#1E3A8A] text-white p-8 lg:p-12 relative overflow-hidden">

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

                    {/* Top logo */}
                    <div className="mb-8">
                        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-100 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            SLIIT Smart Campus
                        </Link>
                    </div>

                    {/* Main text content */}
                    <div className="flex-grow flex flex-col justify-center max-w-lg">
                        <span className="py-1 px-3 rounded-full bg-blue-800/60 border border-blue-700/50 text-blue-200 text-xs font-semibold uppercase mb-4 w-max">
                            Join the Network
                        </span>

                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
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

                    <div className="mt-8 text-blue-300/60 text-sm">
                        © 2026 SLIIT Smart Campus Operations Hub
                    </div>
                </div>
            </div>

            {/* Right section - form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 sm:p-8 relative overflow-y-auto">

                {/* Mobile header view */}
                <div className="md:hidden absolute top-6 left-6 z-10 w-full pr-12 flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-[#1E3A8A] flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-[#1E3A8A] flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-white" />
                        </div>
                        Smart Campus
                    </Link>
                </div>

                <div className="w-full max-w-[400px] mt-12 md:mt-0">
                    <div className="mb-6 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-[#0f172a] mb-2">Create an account</h1>
                        <p className="text-[#475569] text-sm">
                            Already have an account? <a href="#" className="text-[#1E3A8A] font-medium hover:underline">Log in here</a>
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="space-y-1 w-full">
                                <label className="text-xs font-semibold text-[#334155]">First Name</label>
                                <input
                                    type="text"
                                    placeholder="Harsha"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] text-sm text-[#0f172a]"
                                />
                            </div>
                            <div className="space-y-1 w-full">
                                <label className="text-xs font-semibold text-[#334155]">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Fernando"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] text-sm text-[#0f172a]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#334155]">University Email</label>
                            <input
                                type="email"
                                placeholder="idnumber@my.sliit.lk"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] text-sm text-[#0f172a]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="space-y-1 w-full sm:w-1/3">
                                <label className="text-xs font-semibold text-[#334155]">Role</label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] text-sm appearance-none cursor-pointer text-[#0f172a] bg-white">
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
                                <label className="text-xs font-semibold text-[#334155]">ID Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. IT2612345678"
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] text-sm text-[#0f172a]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-[#334155]">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] text-sm text-[#0f172a]"
                            />
                            <p className="text-[11px] text-[#64748B] mt-1.5">Must be at least 8 characters long</p>
                        </div>

                        <div className="flex items-start gap-2.5 pt-2">
                            <div className="flex items-center h-4 mt-0.5">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 border-gray-300 rounded text-[#1E3A8A] focus:ring-[#1E3A8A] cursor-pointer"
                                />
                            </div>
                            <label className="text-xs text-[#475569]">
                                I agree to the <a href="#" className="font-medium text-[#1E3A8A] hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-[#1E3A8A] hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        <button className="w-full bg-[#1E3A8A] hover:bg-[#172D6B] text-white font-medium py-3 px-4 rounded-lg mt-6 flex justify-center items-center gap-2 transition-colors">
                            Create Account
                            <Rocket className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

import React from 'react';

export const LandingPage = () => {
    return (
        // Main wrapper taking up the full screen
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center text-center relative p-5 font-sans">

            {/* Center content block */}
            <div className="max-w-[600px] w-full flex flex-col items-center mb-10">
                <h1 className="text-[28px] sm:text-[32px] font-bold text-[#1E3A8A] mb-5 leading-[1.2]">
                    Smart Campus Operations Hub
                </h1>

                <p className="text-[15px] sm:text-base text-[#475569] max-w-[500px] mb-[30px] sm:mb-10 leading-[1.5]">
                    Manage facilities, bookings and campus maintenance operations efficiently.
                </p>

                {/* Login and register buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-[300px] sm:max-w-none justify-center">
                    <button className="w-full sm:w-auto px-[22px] py-[12px] sm:py-[10px] rounded-lg text-base font-medium transition-all duration-200 outline-none bg-[#1E3A8A] text-white border-2 border-[#1E3A8A] hover:bg-[#172D6B] hover:border-[#172D6B]">
                        Login
                    </button>

                    <button className="w-full sm:w-auto px-[22px] py-[12px] sm:py-[10px] rounded-lg text-base font-medium transition-all duration-200 outline-none bg-transparent text-[#1E3A8A] border-2 border-[#1E3A8A] hover:bg-blue-900/5">
                        Register
                    </button>
                </div>

                <p className="text-xs text-[#94A3B8] mt-2">
                    Only authorized university members can access this system.
                </p>
            </div>

            {/* Bottom footer */}
            <footer className="absolute bottom-5 text-sm text-[#64748B]">
                <p>© 2026 Smart Campus</p>
            </footer>
        </div>
    );
};

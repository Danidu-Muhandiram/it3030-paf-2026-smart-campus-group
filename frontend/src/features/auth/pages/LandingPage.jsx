import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
    return (
        // Main wrapper taking up the full screen
        <div className="min-h-screen bg-bg-main flex flex-col justify-center items-center text-center relative p-5 font-sans">

            {/* Center content block */}
            <div className="max-w-[600px] w-full flex flex-col items-center mb-10">
                <h1 className="text-[28px] sm:text-[32px] font-bold text-primary mb-5 leading-[1.2]">
                    Smart Campus Operations Hub
                </h1>

                <p className="text-[15px] sm:text-base text-text-muted max-w-[500px] mb-[30px] sm:mb-10 leading-[1.5]">
                    Manage facilities, bookings and campus maintenance operations efficiently.
                </p>

                {/* Login and register buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-[300px] sm:max-w-none justify-center">
                    <button className="w-full sm:w-auto px-[22px] py-[12px] sm:py-[10px] rounded-lg text-base font-medium transition-all duration-200 outline-none bg-primary text-white border-2 border-primary hover:bg-primary-hover hover:border-primary-hover">
                        Login
                    </button>

                    <Link to="/register" className="w-full sm:w-auto px-[22px] py-[12px] sm:py-[10px] rounded-lg text-base font-medium transition-all duration-200 outline-none bg-transparent text-primary border-2 border-primary hover:bg-blue-900/5 flex items-center justify-center">
                        Register
                    </Link>
                </div>

                <p className="text-xs text-text-light mt-2">
                    Only authorized university members can access this system.
                </p>
            </div>

            {/* Bottom footer */}
            <footer className="absolute bottom-5 text-sm text-text-light">
                <p>© 2026 Smart Campus</p>
            </footer>
        </div>
    );
};

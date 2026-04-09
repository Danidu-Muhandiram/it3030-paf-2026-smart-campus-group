import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const TopNav = ({ toggleSidebar, isSidebarCollapsed }) => {
    const { user } = useAuth();
    const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User';
    const roleLabel = user?.role || 'Member';
    const initials = displayName
        .split(' ')
        .filter((part) => part)
        .map((part) => part[0])
        .slice(0, 2)
        .join('') || 'U';

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
            {/* Left side: Mobile menu toggle and Search */}
            <div className="flex items-center gap-4 flex-1">
                {/* Mobile menu toggle (visible mostly on small screens) */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden text-gray-500 hover:text-primary transition-colors focus:outline-none"
                >
                    <Menu size={24} />
                </button>

                {/* Search Bar */}
                <div className="relative max-w-md w-full hidden sm:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search resources, tickets, bookings..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* Right side: Notifications and Profile */}
            <div className="flex items-center gap-3 sm:gap-5">
                {/* Search Icon (Mobile only) */}
                <button className="sm:hidden text-gray-400 hover:text-primary transition-colors">
                    <Search size={20} />
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-primary transition-colors focus:outline-none rounded-full hover:bg-gray-50">
                    <Bell size={20} />
                    {/* Notification badge */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                {/* User Profile */}
                <button className="flex items-center gap-3 focus:outline-none rounded-lg hover:bg-gray-50 p-1 pr-2 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {initials}
                    </div>
                    <div className="hidden md:flex flex-col items-start translate-y-[-1px]">
                        <span className="text-sm font-medium text-text-main leading-tight">{displayName}</span>
                        <span className="text-xs text-text-muted leading-tight">{roleLabel}</span>
                    </div>
                </button>
            </div>
        </header>
    );
};

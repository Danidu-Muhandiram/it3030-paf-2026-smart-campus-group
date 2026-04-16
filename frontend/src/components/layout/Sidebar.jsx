import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Settings,
    LogOut,
    Building2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { USER_NAV_ITEMS } from '../../app/navigation/dashboardNavItems';

export const Sidebar = ({
    isCollapsed,
    toggleSidebar,
    isMobileOpen,
    onMobileClose,
    // Defaults keep existing user dashboard behavior when props are omitted.
    navItems = USER_NAV_ITEMS,
    profilePath = '/dashboard/profile',
    brandLabel = 'Smart Campus'
}) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }
        setIsLoggingOut(true);
        try {
            await logout();
            onMobileClose?.();
            navigate('/login', { replace: true });
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleNavClick = () => {
        onMobileClose?.();
    };

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/35 md:hidden"
                    onClick={onMobileClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 h-screen w-64 bg-primary text-white flex flex-col
                    transform transition-transform duration-300
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:relative md:translate-x-0 md:z-auto
                    ${isCollapsed ? 'md:w-20' : 'md:w-64'}
                `}
            >
            {/* Collapse toggle button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-8 hidden md:flex items-center justify-center bg-white text-primary rounded-full p-1 border border-gray-200 shadow-md hover:bg-gray-50 z-10 focus:outline-none"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Header/Logo area */}
            <div className="h-16 flex items-center justify-center border-b border-primary-hover px-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className={`ml-3 font-bold text-lg whitespace-nowrap overflow-hidden transition-all ${isCollapsed ? 'md:hidden' : ''}`}>
                    {brandLabel}
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navItems.map((item) => {
                    // Icon is passed as a component in nav config for flexible menus.
                    const Icon = item.icon;
                    return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) => `
                            flex items-center px-3 py-3 rounded-lg transition-colors
                            ${isActive
                                ? 'bg-white/15 text-white font-medium shadow-sm'
                                : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
                            }
                        `}
                        title={isCollapsed ? item.label : ''}
                    >
                        <span className="shrink-0"><Icon size={20} /></span>
                        <span className={`ml-3 whitespace-nowrap overflow-hidden ${isCollapsed ? 'md:hidden' : ''}`}>
                            {item.label}
                        </span>
                    </NavLink>
                    );
                })}
            </nav>

            {/* Bottom Section (Settings/Logout) */}
            <div className="p-4 border-t border-primary-hover space-y-2">
                <button
                    className="w-full flex items-center px-3 py-2.5 rounded-lg text-blue-100/70 hover:bg-white/5 hover:text-white transition-colors"
                    title={isCollapsed ? 'Settings' : ''}
                    onClick={() => {
                        onMobileClose?.();
                        navigate(profilePath);
                    }}
                >
                    <Settings size={20} className="shrink-0" />
                    <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Profile</span>
                </button>
                <button
                    className="w-full flex items-center px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-500/10 transition-colors mt-2"
                    title={isCollapsed ? 'Log out' : ''}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    aria-busy={isLoggingOut}
                >
                    <LogOut size={20} className="shrink-0" />
                    <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
                </button>
            </div>
            </aside>
        </>
    );
};

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarCheck,
    Ticket,
    Wrench,
    Settings,
    LogOut,
    Building2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    // Navigation items based on requirements
    const navItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/dashboard/facilities', icon: <Building2 size={20} />, label: 'Facilities Catalogue' },
        { path: '/dashboard/bookings', icon: <CalendarCheck size={20} />, label: 'My Bookings' },
        { path: '/dashboard/tickets', icon: <Ticket size={20} />, label: 'Maintenance Tickets' },
    ];

    return (
        <aside
            className={`
                bg-primary text-white h-screen flex flex-col transition-all duration-300 relative
                ${isCollapsed ? 'w-20' : 'w-64'}
            `}
        >
            {/* Collapse toggle button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-8 bg-white text-primary rounded-full p-1 border border-gray-200 shadow-md hover:bg-gray-50 z-10 focus:outline-none"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Header/Logo area */}
            <div className="h-16 flex items-center justify-center border-b border-primary-hover px-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                    <span className="ml-3 font-bold text-lg whitespace-nowrap overflow-hidden transition-all">
                        Smart Campus
                    </span>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center px-3 py-3 rounded-lg transition-colors
                            ${isActive
                                ? 'bg-white/15 text-white font-medium shadow-sm'
                                : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
                            }
                        `}
                        title={isCollapsed ? item.label : ''}
                    >
                        <span className="shrink-0">{item.icon}</span>
                        {!isCollapsed && (
                            <span className="ml-3 whitespace-nowrap overflow-hidden">
                                {item.label}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section (Settings/Logout) */}
            <div className="p-4 border-t border-primary-hover space-y-2">
                <button
                    className="w-full flex items-center px-3 py-2.5 rounded-lg text-blue-100/70 hover:bg-white/5 hover:text-white transition-colors"
                    title={isCollapsed ? 'Settings' : ''}
                >
                    <Settings size={20} className="shrink-0" />
                    {!isCollapsed && <span className="ml-3">Settings</span>}
                </button>
                <button
                    className="w-full flex items-center px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-500/10 transition-colors mt-2"
                    title={isCollapsed ? 'Log out' : ''}
                >
                    <LogOut size={20} className="shrink-0" />
                    {!isCollapsed && <span className="ml-3">Log out</span>}
                </button>
            </div>
        </aside>
    );
};

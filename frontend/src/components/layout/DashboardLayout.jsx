import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export const DashboardLayout = ({
    children,
    // Route wrappers provide role-specific sidebar settings.
    navItems,
    profilePath,
    brandLabel,
}) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleDesktopSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen((prev) => !prev);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-bg-main flex font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleDesktopSidebar}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={closeMobileSidebar}
                navItems={navItems}
                profilePath={profilePath}
                brandLabel={brandLabel}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <TopNav
                    toggleSidebar={toggleMobileSidebar}
                    isSidebarCollapsed={isSidebarCollapsed}
                />

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

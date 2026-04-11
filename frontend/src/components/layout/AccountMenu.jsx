import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, UserCircle2, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export const AccountMenu = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [avatarFailed, setAvatarFailed] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const menuContainerRef = useRef(null);

    const profilePictureUrl = user?.profilePicture?.trim() || '';
    const displayName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User';
    const emailLabel = user?.email || 'No email available';
    const roleLabel = user?.role || 'Member';
    const initials = displayName
        .split(' ')
        .filter((part) => part)
        .map((part) => part[0])
        .slice(0, 2)
        .join('') || 'U';

    useEffect(() => {
        // Reset fallback state when user/image changes.
        setAvatarFailed(false);
    }, [profilePictureUrl, user?.id]);

    useEffect(() => {
        // Close the menu when clicking outside or pressing Escape.
        const handleClickOutside = (event) => {
            if (menuContainerRef.current && !menuContainerRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleLogout = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);
        try {
            await logout();
            setMenuOpen(false);
            navigate('/login', { replace: true });
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleOpenProfile = () => {
        // Keep navigation and menu state in sync.
        setMenuOpen(false);
        navigate('/dashboard/profile');
    };

    return (
        <div className="relative" ref={menuContainerRef}>
            <button
                className="flex items-center gap-3 focus:outline-none rounded-lg hover:bg-gray-50 p-1 pr-2 transition-colors"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
            >
                {profilePictureUrl && !avatarFailed ? (
                    <img
                        src={profilePictureUrl}
                        alt={`${displayName} profile`}
                        onError={() => setAvatarFailed(true)}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {initials}
                    </div>
                )}
                <div className="hidden md:flex flex-col items-start translate-y-[-1px]">
                    <span className="text-sm font-medium text-text-main leading-tight">{displayName}</span>
                    <span className="text-xs text-text-muted leading-tight">{roleLabel}</span>
                </div>
                <ChevronDown size={16} className="hidden md:block text-gray-400" />
            </button>

            {menuOpen && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-20"
                >
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                        {profilePictureUrl && !avatarFailed ? (
                            <img
                                src={profilePictureUrl}
                                alt={`${displayName} profile`}
                                onError={() => setAvatarFailed(true)}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                {initials}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-main truncate">{displayName}</p>
                            <p className="text-xs text-text-muted truncate">{emailLabel}</p>
                        </div>
                    </div>

                    <div className="p-2">
                        {/* Profile is implemented, settings page can be wire later. */}
                        <button
                            role="menuitem"
                            onClick={handleOpenProfile}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-main hover:bg-gray-50"
                        >
                            <UserCircle2 size={16} />
                            My profile
                        </button>
                        <button
                            role="menuitem"
                            disabled
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed"
                        >
                            <Settings size={16} />
                            Account settings (coming soon)
                        </button>
                        <button
                            role="menuitem"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                            <LogOut size={16} />
                            {isLoggingOut ? 'Signing out...' : 'Sign out'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

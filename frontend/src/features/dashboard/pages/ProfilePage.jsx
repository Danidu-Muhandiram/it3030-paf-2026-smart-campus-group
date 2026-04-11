import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

const DetailItem = ({ label, value }) => (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-light">{label}</p>
        <p className="mt-1 text-sm font-medium text-text-main break-all">{value || '-'}</p>
    </div>
);

export const ProfilePage = () => {
    const { user } = useAuth();
    const [avatarFailed, setAvatarFailed] = useState(false);

    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User';
    const profilePictureUrl = user?.profilePicture?.trim() || '';
    const providerLabel = String(user?.provider || 'LOCAL').toUpperCase();
    // Keep provider text user-friendly in the UI.
    const signInMethod = providerLabel === 'GOOGLE' ? 'Signed in with Google' : 'Signed in with local account';

    useEffect(() => {
        // Retry image rendering when profile data changes.
        setAvatarFailed(false);
    }, [profilePictureUrl, user?.id]);

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-text-main">My Profile</h1>
                <p className="mt-1 text-text-muted">View your account details and identity provider information.</p>
            </div>

            <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Fall back to initials when profile image is missing or invalid. */}
                    {profilePictureUrl && !avatarFailed ? (
                        <img
                            src={profilePictureUrl}
                            alt={`${displayName} profile`}
                            onError={() => setAvatarFailed(true)}
                            className="h-16 w-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-semibold text-text-main">{displayName}</h2>
                        <p className="text-sm text-text-muted">{user?.email || 'No email available'}</p>
                        <p className="mt-2 text-xs font-medium text-text-muted">{signInMethod}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-text-main">Account Details</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <DetailItem label="First Name" value={user?.firstName} />
                    <DetailItem label="Last Name" value={user?.lastName} />
                    <DetailItem label="Email" value={user?.email} />
                </div>
            </section>
        </div>
    );
};

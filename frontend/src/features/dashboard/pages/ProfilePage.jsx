import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { authService } from '../../auth/authService';

const DetailItem = ({ label, value, isEditing, name, onChange }) => (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-light">{label}</p>
        {isEditing ? (
            <input
                type="text"
                name={name}
                value={value || ''}
                onChange={onChange}
                className="mt-1 w-full rounded border-gray-200 bg-white px-2 py-1 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                autoFocus={name === 'firstName'}
            />
        ) : (
            <p className="mt-1 text-sm font-medium text-text-main break-all">{value || '-'}</p>
        )}
    </div>
);

export const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [avatarFailed, setAvatarFailed] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User';
    const profilePictureUrl = user?.profilePicture?.trim() || '';
    const providerLabel = String(user?.provider || 'LOCAL').toUpperCase();
    const signInMethod = providerLabel === 'GOOGLE' ? 'Signed in with Google' : 'Signed in with local account';

    useEffect(() => {
        setAvatarFailed(false);
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || ''
            });
        }
    }, [profilePictureUrl, user]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancelled - reset form data
            setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || ''
            });
            setError(null);
        }
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const data = await authService.updateProfile(formData);
            if (data?.user) {
                updateUser(data.user);
            }
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">My Profile</h1>
                    <p className="mt-1 text-text-muted">View your account details and identity provider information.</p>
                </div>
                <button
                    onClick={isEditing ? handleSave : handleEditToggle}
                    disabled={isSaving}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all shadow-sm ${
                        isEditing
                            ? 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50'
                            : 'bg-white border border-gray-200 text-text-main hover:bg-gray-50'
                    }`}
                >
                    {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}

            <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    {profilePictureUrl && !avatarFailed ? (
                        <img
                            src={profilePictureUrl}
                            alt={`${displayName} profile`}
                            onError={() => setAvatarFailed(true)}
                            className="h-16 w-16 rounded-full object-cover border-2 border-gray-50 shadow-sm"
                        />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold border border-primary/20">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <div>
                        <h2 className="text-lg font-semibold text-text-main">{displayName}</h2>
                        <p className="text-sm text-text-muted">{user?.email || 'No email available'}</p>
                        <p className="mt-2 text-xs font-medium text-text-muted uppercase tracking-wider">{signInMethod}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-text-main">Account Details</h3>
                    {isEditing && (
                        <button
                            onClick={handleEditToggle}
                            className="text-xs font-medium text-text-muted hover:text-text-main transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <DetailItem
                        label="First Name"
                        value={isEditing ? formData.firstName : user?.firstName}
                        isEditing={isEditing}
                        name="firstName"
                        onChange={handleChange}
                    />
                    <DetailItem
                        label="Last Name"
                        value={isEditing ? formData.lastName : user?.lastName}
                        isEditing={isEditing}
                        name="lastName"
                        onChange={handleChange}
                    />
                    <DetailItem label="Email" value={user?.email} />
                </div>
            </section>
        </div>
    );
};

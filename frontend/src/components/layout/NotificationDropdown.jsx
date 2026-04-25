import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Clock } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

//notofication dropdown component for the bell icon in the header, 
// shows a list of notifications with options to mark as read or mark all as read. 
// It also polls for unread count every 30 seconds to update the badge count on the bell icon.
export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = async () => {
        setIsLoading(true);
        console.log('Fetching notifications from:', `${API_BASE_URL}/api/v1/notifications`);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/notifications`, {
                withCredentials: true
            });
            console.log('Notifications response:', response.data);
            if (response.data.success) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch the count of unread notifications
    const fetchUnreadCount = async () => {
        try {
            console.log('Fetching unread count...');
            const response = await axios.get(`${API_BASE_URL}/api/v1/notifications/unread-count`, {
                withCredentials: true
            });
            console.log('Unread count response:', response.data);
            if (response.data.success) {
                setUnreadCount(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    // Initial fetch of unread count and set up polling
    useEffect(() => {
        fetchUnreadCount();
        // Polling every 30 seconds for simplicity as requested
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleDropdown = () => {
        if (!isOpen) {
            fetchNotifications();
        }
        setIsOpen(!isOpen);
    };

    // Mark a single notification as read
    const markAsRead = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/api/v1/notifications/${id}/read`, {}, {
                withCredentials: true
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            await axios.put(`${API_BASE_URL}/api/v1/notifications/read-all`, {}, {
                withCredentials: true
            });
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Utility function to format time since notification was created
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none ${
                    unreadCount > 0 
                    ? 'border-red-100 bg-red-50 text-red-500 hover:bg-red-100' 
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
                aria-label={`${unreadCount} notifications`}
            >
                <Bell size={19} className={unreadCount > 0 ? "animate-pulse" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] font-bold leading-5 text-center ring-2 ring-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden transform origin-top-right transition-all duration-200 animate-in fade-in zoom-in-95">
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
                            <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-[10px] font-bold text-primary hover:text-primary-dark transition-colors"
                                >
                                    MARK ALL AS READ
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoading && notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                    <p className="text-xs text-gray-400">Loading notifications...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell size={32} className="mx-auto text-gray-200 mb-2" />
                                    <p className="text-xs text-gray-400">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div 
                                        key={notification.id}
                                        className={`p-4 border-b border-gray-50 flex gap-3 transition-colors hover:bg-gray-50 ${!notification.read ? 'bg-primary/[0.02]' : ''}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-relaxed ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Clock size={12} className="text-gray-400" />
                                                <span className="text-[10px] text-gray-400 font-medium">{formatTime(notification.createdAt)}</span>
                                                {notification.relatedId && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-bold uppercase tracking-tight">
                                                        {notification.relatedId}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {!notification.read && (
                                            <button 
                                                onClick={() => markAsRead(notification.id)}
                                                className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
                                                title="Mark as read"
                                            >
                                                <Check size={14} strokeWidth={3} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                            <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider">
                                View All Activity
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import {
    Building2,
    CalendarCheck,
    Ticket,
    PlusCircle,
    ArrowRight,
    Search,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { getDashboardSummary } from '../../../services/dashboardService';


export const DashboardOverview = () => {
    const { user } = useAuth();
    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User';
    const [now, setNow] = useState(new Date());
    const [summary, setSummary] = useState({ totalResources: 0, myBookings: 0, openTickets: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Keep header timestamp fresh
        const timer = setInterval(() => setNow(new Date()), 30000);
        
        // Fetch dashboard data
        const fetchSummary = async () => {
            try {
                const data = await getDashboardSummary();
                setSummary(data);
            } catch (err) {
                console.error("Failed to fetch dashboard summary:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
        return () => clearInterval(timer);
    }, []);

    const currentDateTime = now.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    // Dynamic data for the dashboard
    const stats = [
        { title: 'Total Resources', value: loading ? '...' : summary.totalResources.toString(), icon: <Building2 size={24} />, colorClass: 'bg-blue-50 text-blue-600' },
        { title: 'My Bookings', value: loading ? '...' : summary.myBookings.toString(), icon: <CalendarCheck size={24} />, colorClass: 'bg-green-50 text-green-600' },
        { title: 'Open Tickets', value: loading ? '...' : summary.openTickets.toString(), icon: <Ticket size={24} />, colorClass: 'bg-orange-50 text-orange-600' },
    ];


    const quickActions = [
        { title: 'Book a Room', description: 'Schedule a lecture hall or meeting room.', icon: <CalendarCheck size={20} />, path: '/dashboard/bookings/new' },
        { title: 'Report Incident', description: 'Log a fault or maintenance request.', icon: <PlusCircle size={20} />, path: '/dashboard/tickets/new' },
        { title: 'Search Equipment', description: 'Find and book available equipment.', icon: <Search size={20} />, path: '/dashboard/facilities?type=equipment' },
        { title: 'Browse Resources', description: 'Explore available rooms, labs, and campus assets.', icon: <Building2 size={20} />, path: '/dashboard/facilities' },
    ];

    const recentActivity = [
        { id: 1, type: 'booking', title: 'Main Auditorium Reservation', status: 'Approved', time: '2 hours ago' },
        { id: 2, type: 'ticket', title: 'Projector repair in Lab 04', status: 'In Progress', time: '5 hours ago' },
        { id: 3, type: 'booking', title: 'Discussion Room 02', status: 'Pending', time: 'Yesterday' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Welcome back, {displayName}!</h1>
                    <p className="text-text-muted mt-1">Track your bookings and campus requests in real time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-text-muted bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <Clock size={16} />
                        {currentDateTime}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Quick Actions & Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-text-main">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                to={action.path}
                                className="group p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex items-start gap-4"
                            >
                                <div className="p-3 bg-primary/5 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                    {action.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">{action.title}</h3>
                                    <p className="text-sm text-text-muted mt-1">{action.description}</p>
                                </div>
                                <ArrowRight size={18} className="text-gray-300 translate-x-0 group-hover:translate-x-1 group-hover:text-primary transition-all self-center" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-text-main">Recent Activity</h2>
                        <button className="text-sm text-primary font-medium hover:underline">View All</button>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={activity.id}
                                className={`p-4 flex gap-4 ${index !== recentActivity.length - 1 ? 'border-b border-gray-50' : ''}`}
                            >
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activity.status === 'Approved' ? 'bg-green-500' :
                                    activity.status === 'In Progress' ? 'bg-blue-500' : 'bg-orange-500'
                                    }`}></div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-text-main leading-tight">{activity.title}</h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-text-muted">{activity.status}</span>
                                        <span className="text-[11px] text-text-light">{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

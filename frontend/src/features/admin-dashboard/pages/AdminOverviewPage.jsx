import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, CalendarClock, CircleAlert, ClipboardList, Ticket, Users } from 'lucide-react';
import { StatCard } from '../../dashboard/components/StatCard';

export const AdminOverviewPage = () => {
    // sample metrics for UI scaffolding until admin APIs are wired.
    const stats = [
        { title: 'Open Tickets', value: '28', icon: <Ticket size={24} />, colorClass: 'bg-orange-50 text-orange-600' },
        { title: 'Resources Active', value: '124', icon: <Building2 size={24} />, colorClass: 'bg-blue-50 text-blue-600' },
        { title: 'Pending Bookings', value: '17', icon: <CalendarClock size={24} />, colorClass: 'bg-green-50 text-green-600' },
        { title: 'Total Users', value: '1,042', icon: <Users size={24} />, colorClass: 'bg-purple-50 text-purple-600' },
    ];

    const quickActions = [
        { title: 'Manage Tickets', description: 'Review and assign incoming maintenance requests.', path: '/admin/tickets', icon: <Ticket size={18} /> },
        { title: 'Resource Directory', description: 'Update room, lab, and equipment availability.', path: '/admin/resources', icon: <Building2 size={18} /> },
        { title: 'User Accounts', description: 'Manage account access and profile details.', path: '/admin/users', icon: <Users size={18} /> },
        { title: 'Reports', description: 'Inspect demand and issue trends by location.', path: '/admin/reports', icon: <ClipboardList size={18} /> },
    ];

    const alerts = [
        { id: 1, title: 'Lab 3 HVAC fault reported', priority: 'High', age: '14m ago' },
        { id: 2, title: 'Projector outage in Hall A', priority: 'Medium', age: '48m ago' },
        { id: 3, title: 'Network latency in Block C', priority: 'Medium', age: '1h ago' },
    ];

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Admin Dashboard</h1>
                    <p className="text-text-muted mt-1">Monitor campus operations, maintenance load, and service health.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <h2 className="text-lg font-bold text-text-main">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.path}
                                to={action.path}
                                className="rounded-lg border border-gray-100 p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                            >
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    {action.icon}
                                    <span>{action.title}</span>
                                </div>
                                <p className="text-sm text-text-muted mt-2">{action.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-2">
                        <CircleAlert size={18} className="text-orange-500" />
                        <h2 className="text-lg font-bold text-text-main">Latest Alerts</h2>
                    </div>
                    <div className="mt-4 space-y-3">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="rounded-lg border border-gray-100 p-3">
                                <p className="text-sm font-semibold text-text-main">{alert.title}</p>
                                <div className="mt-1 flex items-center justify-between text-xs text-text-muted">
                                    <span>{alert.priority} priority</span>
                                    <span>{alert.age}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

import React from 'react';
import { LayoutDashboard, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export const TechnicianOverviewPage = () => {
    // Mock stats for UI demonstration
    const stats = [
        { label: 'Assigned Tasks', value: '12', icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'In Progress', value: '4', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Completed Today', value: '8', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'High Priority', value: '3', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Technician Overview</h1>
                <p className="mt-1 text-text-muted">Welcome back! Here's an overview of your current maintenance tasks.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-muted">{stat.label}</p>
                                <p className="text-2xl font-bold text-text-main">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-bold text-text-main">Recent Task Activity</h3>
                    <button className="text-sm text-primary font-medium hover:underline">View All</button>
                </div>
                <div className="p-6">
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <Clock size={32} />
                        </div>
                        <h4 className="text-lg font-semibold text-text-main">No recent activity</h4>
                        <p className="text-text-muted mt-1 max-w-xs">Your recent updates to tasks will appear here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

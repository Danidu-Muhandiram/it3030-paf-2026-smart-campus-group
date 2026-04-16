import React from 'react';
import { BarChart3, ChartNoAxesCombined, Clock3 } from 'lucide-react';

export const AdminReportsPage = () => {
    // Placeholder KPI cards until reporting endpoints are ready.
    const reportCards = [
        { title: 'Ticket Resolution Rate', value: '82%', subText: 'Past 30 days', icon: <BarChart3 size={20} className="text-blue-600" /> },
        { title: 'Average Response Time', value: '2h 18m', subText: 'All tickets', icon: <Clock3 size={20} className="text-orange-600" /> },
        { title: 'Resource Utilization', value: '74%', subText: 'Campus-wide', icon: <ChartNoAxesCombined size={20} className="text-green-600" /> },
    ];

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Reports & Analytics</h1>
                <p className="mt-1 text-text-muted">Track usage trends and service performance over time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {reportCards.map((card) => (
                    <article key={card.title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-text-main">{card.title}</h2>
                            {card.icon}
                        </div>
                        <p className="mt-4 text-3xl font-bold text-text-main">{card.value}</p>
                        <p className="mt-1 text-xs text-text-muted">{card.subText}</p>
                    </article>
                ))}
            </div>

            <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <p className="text-sm font-semibold text-text-main">Chart Panels</p></section>
        </div>
    );
};

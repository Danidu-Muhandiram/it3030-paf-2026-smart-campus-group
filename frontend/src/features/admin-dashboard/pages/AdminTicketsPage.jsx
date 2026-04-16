import React from 'react';
import { Filter, Ticket } from 'lucide-react';

const statusClassMap = {
    OPEN: 'bg-red-50 text-red-700 border-red-100',
    IN_PROGRESS: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    RESOLVED: 'bg-green-50 text-green-700 border-green-100',
};

export const AdminTicketsPage = () => {
    // sample table rows
    const tickets = [
        { id: 'TKT-220', title: 'Water leakage near Lab 05', location: 'Engineering Block', assignee: 'Maintenance Team A', status: 'OPEN' },
        { id: 'TKT-214', title: 'Broken air conditioner', location: 'Library Floor 2', assignee: 'Facilities Team', status: 'IN_PROGRESS' },
        { id: 'TKT-207', title: 'Projector not powering on', location: 'Auditorium', assignee: 'AV Support', status: 'RESOLVED' },
    ];

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Ticket Management</h1>
                    <p className="mt-1 text-text-muted">Review, assign, and resolve maintenance requests across campus.</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-text-main hover:border-primary/40 hover:text-primary transition-colors">
                    <Filter size={16} />
                    Filter Tickets
                </button>
            </div>

            <section className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-text-light">
                    <span className="col-span-2">Ticket ID</span>
                    <span className="col-span-4">Issue</span>
                    <span className="col-span-2">Location</span>
                    <span className="col-span-2">Assignee</span>
                    <span className="col-span-2">Status</span>
                </div>

                {tickets.map((ticket) => (
                    <div key={ticket.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0 items-center">
                        <span className="col-span-2 text-sm font-semibold text-text-main">{ticket.id}</span>
                        <div className="col-span-4 flex items-center gap-2">
                            <Ticket size={16} className="text-primary" />
                            <span className="text-sm text-text-main">{ticket.title}</span>
                        </div>
                        <span className="col-span-2 text-sm text-text-muted">{ticket.location}</span>
                        <span className="col-span-2 text-sm text-text-muted">{ticket.assignee}</span>
                        <span className="col-span-2">
                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassMap[ticket.status]}`}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                        </span>
                    </div>
                ))}
            </section>
        </div>
    );
};

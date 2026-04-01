import React from 'react';
import { Building2, Cpu, DoorOpen, FlaskConical } from 'lucide-react';

export const AdminResourcesPage = () => {
    // sample resource cards for initial admin UI state.
    const resources = [
        { id: 'RM-101', type: 'Lecture Hall', capacity: 120, status: 'Available', icon: <DoorOpen size={18} className="text-blue-600" /> },
        { id: 'LAB-07', type: 'Computer Lab', capacity: 45, status: 'Maintenance', icon: <Cpu size={18} className="text-orange-600" /> },
        { id: 'LAB-12', type: 'Science Lab', capacity: 30, status: 'Available', icon: <FlaskConical size={18} className="text-green-600" /> },
    ];

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Resource Management</h1>
                <p className="mt-1 text-text-muted">Manage halls, labs, campus equipments and other resources.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {resources.map((resource) => (
                    <article key={resource.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-text-main">
                                <Building2 size={16} className="text-primary" />
                                {resource.id}
                            </div>
                            {resource.icon}
                        </div>
                        <p className="mt-3 text-base font-semibold text-text-main">{resource.type}</p>
                        <div className="mt-3 flex items-center justify-between text-sm">
                            <span className="text-text-muted">Capacity: {resource.capacity}</span>
                            <span className={`font-semibold ${resource.status === 'Available' ? 'text-green-600' : 'text-orange-600'}`}>
                                {resource.status}
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

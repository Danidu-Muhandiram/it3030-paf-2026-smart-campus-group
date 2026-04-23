import React, { useState } from 'react';
import { Ticket, Clock, CheckCircle, MapPin, Calendar, User, Phone, Paperclip, Download, ChevronRight } from 'lucide-react';

const statusStyles = {
    OPEN: 'bg-sky-50 text-sky-700 border-sky-200',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-300',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200'
};

const priorityStyles = {
    HIGH: 'text-rose-600 bg-rose-50',
    MEDIUM: 'text-amber-600 bg-amber-50',
    LOW: 'text-emerald-600 bg-emerald-50'
};

export const TechnicianTasksPage = () => {
    // Mock data for UI demonstration
    const [tasks] = useState([
        {
            ticketId: 101,
            title: 'AC leaking in Lab 302',
            description: 'Water is dripping from the indoor unit, possibly a clogged drain pipe.',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            locationName: 'Engineering Building - 3rd Floor',
            assetName: 'LG Split AC',
            reportedByName: 'John Doe',
            contact: '+94 77 123 4567',
            createdAt: '2026-04-22T08:30:00Z',
            attachmentUrls: []
        },
        {
            ticketId: 105,
            title: 'Projector not turning on',
            description: 'Main lecture hall projector is not responding to remote or manual power button.',
            priority: 'MEDIUM',
            status: 'OPEN',
            locationName: 'Main Auditorium',
            assetName: 'Epson Projector',
            reportedByName: 'Jane Smith',
            contact: '+94 71 987 6543',
            createdAt: '2026-04-23T09:15:00Z',
            attachmentUrls: []
        }
    ]);

    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const selectedTask = tasks.find(t => t.ticketId === selectedTaskId);

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Assigned Tasks</h1>
                <p className="mt-1 text-text-muted">Manage and resolve maintenance requests assigned to you.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Task List */}
                <section className={`lg:col-span-5 space-y-3 ${selectedTaskId ? 'hidden lg:block' : 'block'}`}>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                            <span className="text-xs font-semibold uppercase tracking-wider text-text-light">
                                My Tasks ({tasks.length})
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {tasks.map((task) => (
                                <button
                                    key={task.ticketId}
                                    onClick={() => setSelectedTaskId(task.ticketId)}
                                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex flex-col gap-2 ${selectedTaskId === task.ticketId ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-xs font-mono font-bold text-primary">TCK-{task.ticketId}</span>
                                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusStyles[task.status]}`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-text-main line-clamp-1">{task.title}</h3>
                                    <div className="flex items-center gap-3 text-[11px] text-text-light">
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {task.locationName}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Task Detail */}
                <section className={`lg:col-span-7 ${!selectedTaskId ? 'hidden lg:flex' : 'block'} flex-col`}>
                    {!selectedTask ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                <Ticket size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-text-main">Select a task to view details</h3>
                            <p className="text-text-muted mt-1 max-w-xs">Choose a task from the list to start working on it.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                <div className="flex flex-col gap-1">
                                    <button 
                                        onClick={() => setSelectedTaskId(null)}
                                        className="lg:hidden text-xs text-primary font-medium mb-2 flex items-center gap-1"
                                    >
                                        ← Back to list
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-text-main">{selectedTask.title}</h2>
                                        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${statusStyles[selectedTask.status]}`}>
                                            {selectedTask.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-text-muted">
                                        <span className="font-mono text-primary font-semibold">TCK-{selectedTask.ticketId}</span>
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${priorityStyles[selectedTask.priority]}`}>
                                            {selectedTask.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Location & Asset */}
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-text-light uppercase tracking-wider">Location & Asset</p>
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-text-main">{selectedTask.assetName}</p>
                                            <p className="text-xs text-text-muted">{selectedTask.locationName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-text-light uppercase tracking-wider">Issue Description</p>
                                    <div className="bg-white border border-gray-100 rounded-lg p-4 text-sm text-text-main leading-relaxed">
                                        {selectedTask.description}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 border-t border-gray-100 space-y-4">
                                    <p className="text-xs font-bold text-text-light uppercase tracking-wider">Task Actions</p>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedTask.status === 'OPEN' && (
                                            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors">
                                                <Clock size={18} /> Start Progress
                                            </button>
                                        )}
                                        {selectedTask.status === 'IN_PROGRESS' && (
                                            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors">
                                                <CheckCircle size={18} /> Mark as Resolved
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

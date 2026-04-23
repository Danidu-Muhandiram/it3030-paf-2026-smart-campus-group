import React, { useEffect, useMemo, useState } from 'react';
import { Ticket, Clock, CheckCircle, MapPin, Calendar, User, Phone, Paperclip, Download } from 'lucide-react';
import { getMyAssignedTickets, resolveTicket, startTicketProgress } from '../services/technicianTicketService';

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

const formatDateTime = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

export const TechnicianTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [resolutionNotes, setResolutionNotes] = useState('');

    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const selectedTask = useMemo(() => tasks.find(t => t.ticketId === selectedTaskId) || null, [tasks, selectedTaskId]);

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getMyAssignedTickets();
            if (response.success) {
                setTasks(response.data || []);
            } else {
                setError(response.message || 'Failed to load assigned tickets');
            }
        } catch (err) {
            console.error('Error fetching technician tasks:', err);
            setError('Network error: Could not load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (selectedTask?.resolutionNotes) {
            setResolutionNotes(selectedTask.resolutionNotes);
            return;
        }
        setResolutionNotes('');
    }, [selectedTask?.ticketId, selectedTask?.resolutionNotes]);

    const updateTaskInState = (updatedTask) => {
        setTasks((prev) => prev.map((task) => task.ticketId === updatedTask.ticketId ? updatedTask : task));
    };

    const handleStartProgress = async () => {
        if (!selectedTask) return;

        setActionLoading(true);
        try {
            const response = await startTicketProgress(selectedTask.ticketId);
            if (response.success) {
                updateTaskInState(response.data);
            } else {
                setError(response.message || 'Failed to update task status');
            }
        } catch (err) {
            console.error('Error starting ticket progress:', err);
            setError('Could not update task status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleResolve = async () => {
        if (!selectedTask || !resolutionNotes.trim()) {
            return;
        }

        setActionLoading(true);
        setError('');
        try {
            const response = await resolveTicket(selectedTask.ticketId, resolutionNotes.trim());
            if (response.success) {
                updateTaskInState(response.data);
            } else {
                setError(response.message || 'Failed to resolve task');
            }
        } catch (err) {
            console.error('Error resolving ticket:', err);
            setError('Could not resolve task');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Assigned Tasks</h1>
                <p className="mt-1 text-text-muted">Manage and resolve maintenance requests assigned to you.</p>
            </div>

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Task List */}
                <section className={`lg:col-span-5 space-y-3 ${selectedTaskId ? 'hidden lg:block' : 'block'}`}>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                            <span className="text-xs font-semibold uppercase tracking-wider text-text-light">
                                My Tasks ({tasks.length})
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50 max-h-[calc(100vh-280px)] overflow-y-auto">
                            {loading ? (
                                <div className="p-10 text-center text-text-muted">Loading...</div>
                            ) : tasks.length === 0 ? (
                                <div className="p-10 text-center text-text-muted">No assigned tasks yet</div>
                            ) : tasks.map((task) => (
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
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {formatDateTime(task.createdAt)}</span>
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
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDateTime(selectedTask.createdAt)}</span>
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

                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-text-light uppercase tracking-wider flex items-center gap-2">
                                        <Paperclip size={14} /> Attachments
                                    </p>
                                    {!selectedTask.attachmentUrls || selectedTask.attachmentUrls.length === 0 ? (
                                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm text-text-muted">
                                            No attachments.
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-3">
                                            {selectedTask.attachmentUrls.map((url, idx) => {
                                                const fullUrl = `${API_BASE_URL}${url}`;
                                                const fileName = url.split('/').pop();
                                                return (
                                                    <a
                                                        key={`${url}-${idx}`}
                                                        href={fullUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-text-main hover:border-primary transition-colors"
                                                    >
                                                        <Download size={14} className="text-primary" />
                                                        <span className="max-w-45 truncate">{fileName}</span>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 border-t border-gray-100 space-y-4">
                                    <p className="text-xs font-bold text-text-light uppercase tracking-wider">Task Actions</p>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedTask.status === 'OPEN' && (
                                            <button
                                                onClick={handleStartProgress}
                                                disabled={actionLoading}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 disabled:opacity-50 transition-colors"
                                            >
                                                <Clock size={18} /> Start Progress
                                            </button>
                                        )}
                                        {selectedTask.status === 'IN_PROGRESS' && (
                                            <div className="w-full space-y-3">
                                                <textarea
                                                    value={resolutionNotes}
                                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                                    rows={4}
                                                    placeholder="Add what was fixed before marking as resolved..."
                                                    className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                />
                                                <button
                                                    onClick={handleResolve}
                                                    disabled={actionLoading || !resolutionNotes.trim()}
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                                >
                                                    <CheckCircle size={18} /> Mark as Resolved
                                                </button>
                                            </div>
                                        )}
                                        {(selectedTask.status === 'RESOLVED' || selectedTask.status === 'CLOSED' || selectedTask.status === 'REJECTED') && (
                                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-text-muted">
                                                {selectedTask.status === 'RESOLVED' && selectedTask.resolutionNotes ? selectedTask.resolutionNotes : 'This task is finalized and no further technician action is required.'}
                                            </div>
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

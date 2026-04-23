import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Ticket, CheckCircle, XCircle, Clock, Check, AlertCircle, User, MapPin, Phone, Calendar, Paperclip, Download } from 'lucide-react';
import { assignTicket, getAllTickets, updateTicketStatus } from '../services/adminTicketService';
import { TicketComments } from '../../tickets/components/TicketComments';

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

export const AdminTicketsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [filter, setFilter] = useState('ALL');
    
    // Rejection state
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        setError('');
        try {
            const ticketsResponse = await getAllTickets();

            if (ticketsResponse.success) {
                setTickets(ticketsResponse.data || []);
            } else {
                setError(ticketsResponse.message || 'Failed to fetch tickets');
            }
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError('Network error: Could not load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const filteredTickets = useMemo(() => {
        if (filter === 'ALL') return tickets;
        return tickets.filter(t => t.status === filter);
    }, [tickets, filter]);

    const selectedTicket = useMemo(() => {
        return tickets.find(t => t.ticketId === selectedTicketId) || null;
    }, [tickets, selectedTicketId]);

    const handleUpdateStatus = async (status, notes = null, reason = null) => {
        if (!selectedTicketId) return;
        
        setActionLoading(true);
        try {
            const response = await updateTicketStatus(selectedTicketId, {
                status,
                resolutionNotes: notes,
                rejectionReason: reason
            });
            
            if (response.success) {
                // Update local state
                setTickets(prev => prev.map(t => t.ticketId === selectedTicketId ? response.data : t));
                setIsRejecting(false);
                setRejectionReason('');
            } else {
                alert(response.message || 'Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Error updating status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAssignTechnician = async () => {
        if (!selectedTicketId) {
            return;
        }

        setActionLoading(true);
        try {
            const response = await assignTicket(selectedTicketId);
            if (response.success) {
                setTickets((prev) => prev.map((t) => t.ticketId === selectedTicketId ? response.data : t));
            } else {
                alert(response.message || 'Failed to assign technician');
            }
        } catch (err) {
            console.error('Error assigning technician:', err);
            alert('Error assigning technician');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Ticket Management</h1>
                    <p className="mt-1 text-text-muted">Review, assign, and resolve maintenance requests across campus.</p>
                </div>
                <div className="flex items-center gap-2">
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Ticket List */}
                <section className={`lg:col-span-5 space-y-3 ${selectedTicketId ? 'hidden lg:block' : 'block'}`}>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-text-light">
                                Tickets ({filteredTickets.length})
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50 max-h-[calc(100vh-280px)] overflow-y-auto">
                            {loading ? (
                                <div className="p-10 text-center text-text-muted">Loading...</div>
                            ) : filteredTickets.length === 0 ? (
                                <div className="p-10 text-center text-text-muted">No tickets found</div>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <button
                                        key={ticket.ticketId}
                                        onClick={() => setSelectedTicketId(ticket.ticketId)}
                                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex flex-col gap-2 ${selectedTicketId === ticket.ticketId ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-xs font-mono font-bold text-primary">TCK-{ticket.ticketId}</span>
                                            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusStyles[ticket.status]}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-text-main line-clamp-1">{ticket.title}</h3>
                                        <div className="flex items-center gap-3 text-[11px] text-text-light">
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {ticket.locationName || 'N/A'}</span>
                                            <span className="flex items-center gap-1"><Clock size={12} /> {formatDateTime(ticket.createdAt)}</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Ticket Detail */}
                <section className={`lg:col-span-7 ${!selectedTicketId ? 'hidden lg:flex' : 'block'} flex-col`}>
                    {!selectedTicket ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                <Ticket size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-text-main">Select a ticket to view details</h3>
                            <p className="text-text-muted mt-1 max-w-xs">Choose a ticket from the list to review the reported issue and manage its status.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
                            {/* Detail Header */}
                            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
                                <div className="flex flex-col gap-1">
                                    <button 
                                        onClick={() => setSelectedTicketId(null)}
                                        className="lg:hidden text-xs text-primary font-medium mb-2 flex items-center gap-1"
                                    >
                                        ← Back to list
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-text-main">{selectedTicket.title}</h2>
                                        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${statusStyles[selectedTicket.status]}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-text-muted">
                                        <span className="font-mono text-primary font-semibold">TCK-{selectedTicket.ticketId}</span>
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDateTime(selectedTicket.createdAt)}</span>
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${priorityStyles[selectedTicket.priority]}`}>
                                            {selectedTicket.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Reporter & Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-text-light uppercase tracking-wider">Reported By</p>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-text-main">{selectedTicket.reportedByName}</p>
                                                <p className="text-xs text-text-muted flex items-center gap-1">
                                                    <Phone size={10} /> {selectedTicket.contact || 'No contact provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-text-light uppercase tracking-wider">Location & Asset</p>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-text-main">{selectedTicket.assetName}</p>
                                                <p className="text-xs text-text-muted">{selectedTicket.locationName || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-text-light uppercase tracking-wider">Issue Description</p>
                                    <div className="bg-white border border-gray-100 rounded-lg p-4 text-sm text-text-main leading-relaxed shadow-sm">
                                        {selectedTicket.description}
                                    </div>
                                </div>

                                {/* Attachments */}
                                {selectedTicket.attachmentUrls && selectedTicket.attachmentUrls.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-text-light uppercase tracking-wider flex items-center gap-2">
                                            <Paperclip size={14} /> Attachments
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedTicket.attachmentUrls.map((url, idx) => {
                                                const isImage = /\.(jpe?g|png|gif|webp)$/i.test(url);
                                                const fileName = url.split('/').pop();
                                                const fullUrl = `http://localhost:8085${url}`;

                                                return (
                                                    <div key={idx} className="group relative">
                                                        {isImage ? (
                                                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                                                                <img src={fullUrl} alt="Attachment" className="w-full h-full object-cover" />
                                                                <a href={fullUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                                                                    View
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <a href={fullUrl} download className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-text-main hover:border-primary transition-colors">
                                                                <Download size={14} className="text-primary" />
                                                                <span className="max-w-25 truncate">{fileName}</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Admin Action History (Notes/Reason) */}
                                {selectedTicket.rejectionReason && (
                                    <div className="space-y-3 border-t border-gray-50 pt-6">
                                        <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
                                            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                <AlertCircle size={14} /> Rejection Reason
                                            </p>
                                            <p className="text-sm text-rose-800">{selectedTicket.rejectionReason}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedTicket.resolutionNotes && (
                                    <div className="space-y-3 border-t border-gray-50 pt-6">
                                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                                <CheckCircle size={14} /> Resolution Notes
                                            </p>
                                            <p className="text-sm text-emerald-800">{selectedTicket.resolutionNotes}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-gray-50 pt-6">
                                    <TicketComments 
                                        ticketId={selectedTicket.ticketId} 
                                        ticketStatus={selectedTicket.status}
                                    />
                                </div>
                            </div>

                            {/* Detail Actions */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                {isRejecting ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-bold text-text-main mb-1 block">Rejection Reason <span className="text-rose-500">*</span></label>
                                            <textarea 
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                placeholder="Provide a reason why this ticket is being rejected..."
                                                className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => handleUpdateStatus('REJECTED', null, rejectionReason)}
                                                disabled={!rejectionReason.trim() || actionLoading}
                                                className="px-6 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 disabled:opacity-50 transition-colors"
                                            >
                                                Confirm Rejection
                                            </button>
                                            <button 
                                                onClick={() => { setIsRejecting(false); setRejectionReason(''); }}
                                                className="px-6 py-2 bg-white border border-gray-200 text-text-main rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : selectedTicket.status === 'REJECTED' || selectedTicket.status === 'CLOSED' ? (
                                    <div className="flex items-center gap-2 text-text-muted py-2">
                                        <CheckCircle size={16} />
                                        <span className="text-sm font-medium">
                                            {selectedTicket.status === 'REJECTED' ? 'This ticket has been rejected.' : 'This ticket has been closed.'}
                                        </span>
                                    </div>
                                ) : selectedTicket.status === 'RESOLVED' ? (
                                    <div className="flex flex-wrap items-center gap-4">
                                        <button
                                            onClick={() => handleUpdateStatus('CLOSED')}
                                            disabled={actionLoading}
                                            className="px-6 py-2.5 bg-slate-700 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                                        >
                                            <Check size={18} /> Close Ticket
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {selectedTicket.status === 'OPEN' && (
                                            <button
                                                onClick={handleAssignTechnician}
                                                disabled={actionLoading}
                                                className="px-6 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Clock size={18} /> Assign Technician
                                            </button>
                                        )}

                                        {selectedTicket.status === 'OPEN' && (
                                            <button
                                                onClick={() => setIsRejecting(true)}
                                                className="px-6 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-50 transition-colors flex items-center gap-2"
                                            >
                                                <XCircle size={18} /> Reject
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

import React, { useMemo, useState, useEffect } from 'react'
import { MessageSquare, Paperclip, PlusCircle, X, Download, MoreHorizontal } from 'lucide-react'
import { TicketComments } from '../components/TicketComments'
import { getAllAssets, getAllResourceTypes } from '../../../services/resourceService'
import { validateTicketForm, validateEditTicketForm } from '../utils/ticketValidation'

// workflow shown to end users.
const WORKFLOW = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085'

// Shared status colors for badges across this page.
const STATUS_STYLES = {
    OPEN: 'bg-sky-50 text-sky-700 border-sky-200',
    IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-300',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200'
}

const STATUS_SELECTED_BUTTON_STYLES = {
    OPEN: 'bg-sky-600 text-white border-sky-600 shadow-sm',
    IN_PROGRESS: 'bg-amber-500 text-white border-amber-500 shadow-sm',
    RESOLVED: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    CLOSED: 'bg-slate-700 text-white border-slate-700 shadow-sm',
    REJECTED: 'bg-rose-600 text-white border-rose-600 shadow-sm'
}

const getStatusButtonClass = (status, isSelected) => {
    if (status === 'ALL') {
        return isSelected
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-text-muted border-gray-200 hover:border-primary/40'
    }

    const baseStyle = STATUS_STYLES[status] || 'bg-white text-text-muted border-gray-200'
    return isSelected
        ? (STATUS_SELECTED_BUTTON_STYLES[status] || 'bg-primary text-white border-primary shadow-sm')
        : `${baseStyle} opacity-80 hover:opacity-100`
}

const formatDateTime = (value) => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

// We will fetch these from the API dynamically now
// const CATEGORY_OPTIONS = [...]
// const RESOURCE_OPTIONS = [...]

export const TicketsPage = () => {
    // Local state for tickets - loaded from API on mount
    const [tickets, setTickets] = useState([])
    const [ticketsLoading, setTicketsLoading] = useState(true)
    const [ticketsError, setTicketsError] = useState('')

    const [resourceTypes, setResourceTypes] = useState([])
    const [allAssets, setAllAssets] = useState([])

    // Map a raw API TicketListItem to the shape the UI expects
    const mapApiTicket = (t) => ({
        id: `TCK-${t.ticketId}`,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        assignedToName: t.assignedToName || '',
        resolutionNotes: t.resolutionNotes || '',
        rejectionReason: t.rejectionReason || '',
        preferredContact: t.contact || '',
        location: t.locationName || '',
        resourceLabel: t.assetName || '',
        resourceId: t.assetId,
        createdAt: t.createdAt,
        // Store full URL objects so we can render images and offer download links
        attachments: (t.attachmentUrls || []).map(url => ({
            name: url.substring(url.lastIndexOf('/') + 1),
            url: `http://localhost:8085${url}`,
            isImage: /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(url)
        })),
        comments: []
    })


    const getTicketNumericId = (ticketId) => {
        const value = Number(String(ticketId || '').replace('TCK-', ''))
        return Number.isNaN(value) ? null : value
    }

    const fetchMyTickets = async () => {
        setTicketsLoading(true)
        setTicketsError('')
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/tickets`, {
                credentials: 'include'
            })
            const data = await response.json()
            if (response.ok && data.success) {
                setTickets((data.data || []).map(mapApiTicket))
            } else {
                setTicketsError(data.message || 'Failed to load tickets')
            }
        } catch (err) {
            console.error('Failed to fetch tickets', err)
            setTicketsError('Network error — could not load tickets')
        } finally {
            setTicketsLoading(false)
        }
    }

    useEffect(() => {
        fetchMyTickets()
    }, [])

    useEffect(() => {
        const loadResources = async () => {
            try {
                const types = await getAllResourceTypes();
                const assets = await getAllAssets();
                setResourceTypes(types || []);
                setAllAssets(assets || []);

                if (types && types.length > 0) {
                    setNewTicket(prev => ({ ...prev, category: types[0].name }));
                }
                if (assets && assets.length > 0) {
                    setNewTicket(prev => ({ ...prev, resourceId: assets[0].id }));
                }
            } catch (error) {
                console.error("Failed to load resources for tickets", error);
            }
        };
        loadResources();
    }, []);

    const [filter, setFilter] = useState('ALL')
    const [selectedTicketId, setSelectedTicketId] = useState(null)
    const [lightboxUrl, setLightboxUrl] = useState(null)
    const [errors, setErrors] = useState({})
    const [editErrors, setEditErrors] = useState({})
    const [fileWarning, setFileWarning] = useState('')
    const [isEditingTicket, setIsEditingTicket] = useState(false)
    const [editTicketData, setEditTicketData] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const [newTicket, setNewTicket] = useState({
        title: '',
        category: '',
        resourceId: '',
        description: '',
        priority: 'MEDIUM',
        preferredContact: ''
    })
    const [newFiles, setNewFiles] = useState([])

    const filteredTickets = useMemo(() => {
        if (filter === 'ALL') {
            return tickets
        }
        return tickets.filter((ticket) => ticket.status === filter)
    }, [tickets, filter])

    const selectedTicket = useMemo(() => {
        return tickets.find((ticket) => ticket.id === selectedTicketId) || null
    }, [tickets, selectedTicketId])

    const handleNewInputChange = (event) => {
        const { name, value } = event.target
        setNewTicket((prev) => {
            const updated = { ...prev, [name]: value };
            // If category changes, try to auto-select the first asset in that category
            if (name === 'category') {
                const filtered = allAssets.filter(a => a.type?.name === value);
                if (filtered.length > 0) {
                    updated.resourceId = filtered[0].id;
                } else {
                    updated.resourceId = '';
                }
            }
            return updated;
        })
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }

    const handleBlur = (event) => {
        const { name } = event.target;
        const validationErrors = validateTicketForm(newTicket, newFiles);
        if (validationErrors[name]) {
            setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleEditBlur = (event) => {
        const { name } = event.target;
        const validationErrors = validateEditTicketForm(editTicketData);
        if (validationErrors[name]) {
            setEditErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
        } else {
            setEditErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFilesChange = (event) => {
        const files = Array.from(event.target.files || [])
        let processedFiles = files;
        
        if (files.length > 3) {
            setFileWarning('Only the first 3 images were selected (max 3).')
            processedFiles = files.slice(0, 3);
        } else {
            setFileWarning('')
        }
        
        setNewFiles(processedFiles)
        
        // Immediate validation for files
        const validationErrors = validateTicketForm(newTicket, processedFiles);
        if (validationErrors.files) {
            setErrors(prev => ({ ...prev, files: validationErrors.files }));
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.files;
                return newErrors;
            });
        }
    }

    useEffect(() => {
        setIsEditingTicket(false);
    }, [selectedTicketId]);

    const handleCreateTicket = async (event) => {
        event.preventDefault()
        setErrors({})

        const validationErrors = validateTicketForm(newTicket, newFiles)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const formData = new FormData()
        formData.append('title', newTicket.title.trim())
        formData.append('description', newTicket.description.trim())
        formData.append('category', newTicket.category)
        formData.append('priority', newTicket.priority)
        formData.append('assetId', newTicket.resourceId) // Maps to Long assetId in backend
        formData.append('contact', newTicket.preferredContact.trim())

        newFiles.forEach((file) => {
            formData.append('files', file)
        })

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/tickets`, {
                method: 'POST',
                body: formData,
                credentials: 'include' // Important for auth cookies!
            })

            const data = await response.json()
            
            if (!response.ok || !data.success) {
                setErrors({ server: data.message || data.error || 'Failed to create ticket' })
                return
            }

            const ticketData = data.data

            // Re-fetch from server so the full list stays in sync with the database
            await fetchMyTickets()
            // Auto-select the newly created ticket using its real DB id
            setSelectedTicketId(`TCK-${ticketData.ticketId}`)
            setNewTicket({
                title: '',
                category: resourceTypes.length > 0 ? resourceTypes[0].name : '',
                resourceId: allAssets.length > 0 ? allAssets[0].id : '',
                description: '',
                priority: 'MEDIUM',
                preferredContact: ''
            })
            setNewFiles([])
            setFileWarning('')
        } catch (error) {
            console.error('Ticket creation error', error)
            setErrors({ server: 'Network error occurred while submitting ticket' })
        }
    }

    const handleUpdateTicket = async (event) => {
        event.preventDefault()
        if (!editTicketData) return
        setEditErrors({})

        const validationErrors = validateEditTicketForm(editTicketData)
        if (Object.keys(validationErrors).length > 0) {
            setEditErrors(validationErrors)
            return
        }

        const numericId = getTicketNumericId(editTicketData.id)
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${numericId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: editTicketData.title,
                    description: editTicketData.description,
                    priority: editTicketData.priority,
                    assetId: editTicketData.resourceId,
                    contact: editTicketData.preferredContact
                })
            })
            const data = await response.json()
            if (response.ok && data.success) {
                await fetchMyTickets()
                setIsEditingTicket(false)
            } else {
                alert(data.message || 'Failed to update ticket')
            }
        } catch (error) {
            console.error('Update error', error)
            alert('Network error')
        }
    }

    const handleDeleteTicket = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return
        
        const numericId = getTicketNumericId(ticketId)
        setIsDeleting(true)
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${numericId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            const data = await response.json()
            if (response.ok && data.success) {
                setSelectedTicketId(null)
                await fetchMyTickets()
            } else {
                alert(data.message || 'Failed to delete ticket')
            }
        } catch (error) {
            console.error('Delete error', error)
            alert('Network error')
        } finally {
            setIsDeleting(false)
        }
    }


    return (
        <div className="space-y-6 pb-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-text-main">Maintenance Tickets</h1>
                <p className="text-sm text-text-muted">
                    Create a ticket, track progress, comment with technicians, and upload supporting images.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Left: ticket creation form */}
                <section className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <PlusCircle size={18} className="text-primary" />
                        <h2 className="text-base font-semibold text-text-main">Create Ticket</h2>
                    </div>

                    <form className="space-y-4" onSubmit={handleCreateTicket}>
                        <div>
                            <label className="text-xs font-medium text-text-muted">Title</label>
                            <input
                                name="title"
                                value={newTicket.title}
                                onChange={handleNewInputChange}
                                onBlur={handleBlur}
                                placeholder="Projector not turning on"
                                className={`mt-1 w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                                    errors.title 
                                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/30' 
                                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                                }`}
                            />
                            {errors.title && <p className="mt-1 text-[10px] font-medium text-rose-600">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-medium text-text-muted">Category</label>
                            <select
                                name="category"
                                value={newTicket.category}
                                onChange={handleNewInputChange}
                                onBlur={handleBlur}
                                className={`mt-1 w-full px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 transition-all ${
                                    errors.category 
                                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/30' 
                                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                                }`}
                            >
                                {resourceTypes.map((type) => (
                                    <option key={type.id} value={type.name}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-[10px] font-medium text-rose-600">{errors.category}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-medium text-text-muted">Resource</label>
                            <select
                                name="resourceId"
                                value={newTicket.resourceId}
                                onChange={handleNewInputChange}
                                onBlur={handleBlur}
                                className={`mt-1 w-full px-3 py-2 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 transition-all ${
                                    errors.resourceId 
                                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/30' 
                                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                                }`}
                                disabled={!newTicket.category}
                            >
                                <option value="">Select a resource</option>
                                {allAssets.filter(r => r.type?.name === newTicket.category).map((resource) => (
                                    <option key={resource.id} value={resource.id}>
                                        {resource.name} {resource.location && `(${resource.location.name})`}
                                    </option>
                                ))}
                            </select>
                            {errors.resourceId && <p className="mt-1 text-[10px] font-medium text-rose-600">{errors.resourceId}</p>}
                        </div>

                        <div>
                            <p className="text-xs font-medium text-text-muted">Priority</p>
                            <div className="mt-1 flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                                {['LOW', 'MEDIUM', 'HIGH'].map((level) => (
                                    <label key={level} className="inline-flex items-center gap-2 text-sm text-text-main cursor-pointer">
                                        <input
                                            type="radio"
                                            name="priority"
                                            value={level}
                                            checked={newTicket.priority === level}
                                            onChange={handleNewInputChange}
                                            className="h-4 w-4 accent-primary"
                                        />
                                        <span>{level.charAt(0) + level.slice(1).toLowerCase()}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-text-muted">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={newTicket.description}
                                onChange={handleNewInputChange}
                                onBlur={handleBlur}
                                placeholder="Describe the issue clearly..."
                                className={`mt-1 w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                                    errors.description 
                                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/30' 
                                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                                }`}
                            />
                            {errors.description && <p className="mt-1 text-[10px] font-medium text-rose-600">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="text-xs font-medium text-text-muted">Preferred Contact (Optional)</label>
                            <input
                                name="preferredContact"
                                type="tel"
                                value={newTicket.preferredContact}
                                onChange={handleNewInputChange}
                                onBlur={handleBlur}
                                placeholder="+94 xxx xxxx"
                                className={`mt-1 w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all ${
                                    errors.preferredContact 
                                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/30' 
                                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                                }`}
                            />
                            {errors.preferredContact && <p className="mt-1 text-[10px] font-medium text-rose-600">{errors.preferredContact}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-xs font-medium text-text-muted">Upload Images</label>
                                <span className="text-[11px] text-text-light">Max 3</span>
                            </div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFilesChange}
                                className={`mt-1 block w-full text-xs text-text-muted file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary ${
                                    errors.files ? 'border border-dashed border-rose-300 bg-rose-50/30 p-2 rounded-lg' : ''
                                }`}
                            />
                            {errors.files && <p className="mt-1 text-[10px] font-medium text-rose-600">{errors.files}</p>}
                            {newFiles.length > 0 && (
                                <ul className="mt-2 flex flex-wrap gap-2">
                                    {newFiles.map((file) => (
                                        <li key={file.name} className="text-[11px] px-2 py-1 rounded border border-gray-200 bg-gray-50 text-text-muted">
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {errors.server && <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-100">{errors.server}</p>}
                        {fileWarning && <p className="text-xs text-amber-700">{fileWarning}</p>}

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            Submit Ticket
                        </button>
                    </form>
                </section>

                {/* Right: ticket list and selected ticket detail */}
                <section className="xl:col-span-3 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm min-h-96">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <h2 className="text-base font-semibold text-text-main">My Tickets</h2>
                            <div className="flex flex-wrap gap-2">
                                {['ALL', ...WORKFLOW].map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setFilter(option)}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${getStatusButtonClass(option, filter === option)}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 space-y-3 max-h-95 overflow-y-auto pr-1">
                            {ticketsLoading && (
                                <div className="text-sm text-text-muted border border-dashed border-gray-300 rounded-lg p-4 flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Loading your tickets…
                                </div>
                            )}

                            {!ticketsLoading && ticketsError && (
                                <div className="text-sm text-red-600 border border-dashed border-red-300 rounded-lg p-4">
                                    {ticketsError}
                                </div>
                            )}

                            {!ticketsLoading && !ticketsError && filteredTickets.length === 0 && (
                                <div className="text-sm text-text-muted border border-dashed border-gray-300 rounded-lg p-4">
                                    No tickets in this state yet.
                                </div>
                            )}

                            {filteredTickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    type="button"
                                    onClick={() => setSelectedTicketId(ticket.id)}
                                    className={`w-full text-left border rounded-lg p-3 transition-colors ${selectedTicketId === ticket.id ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/40'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-text-main">{ticket.title}</p>
                                            <p className="text-xs text-text-light mt-1">{ticket.id} • {formatDateTime(ticket.createdAt)}</p>
                                        </div>
                                        <span className={`text-[11px] px-2 py-1 rounded border ${STATUS_STYLES[ticket.status]}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-muted mt-2 line-clamp-2">{ticket.description}</p>
                                </button>
                            ))}
                        </div>

                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        {!selectedTicket ? (
                            <p className="text-sm text-text-muted">Select a ticket to view details.</p>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <h3 className="text-base font-semibold text-text-main">{selectedTicket.title}</h3>
                                        <p className="text-xs text-text-light">{selectedTicket.id} • {selectedTicket.location || 'No location set'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {selectedTicket.status === 'OPEN' && !isEditingTicket && (
                                            <button 
                                                onClick={() => {
                                                    setIsEditingTicket(true);
                                                    setEditTicketData({ ...selectedTicket });
                                                }}
                                                className="px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/10 rounded border border-primary/20"
                                            >
                                                EDIT TICKET
                                            </button>
                                        )}
                                        {(selectedTicket.status === 'CLOSED' || selectedTicket.status === 'OPEN') && (
                                            <button 
                                                onClick={() => handleDeleteTicket(selectedTicket.id)}
                                                disabled={isDeleting}
                                                className="px-2 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded border border-rose-100"
                                            >
                                                {isDeleting ? 'DELETING...' : 'DELETE TICKET'}
                                            </button>
                                        )}
                                        <span className={`text-xs px-2.5 py-1 rounded border w-fit ${STATUS_STYLES[selectedTicket.status]}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                </div>

                                {isEditingTicket ? (
                                    <form onSubmit={handleUpdateTicket} className="space-y-4 bg-primary/5 p-4 rounded-lg border border-primary/10">
                                        <div>
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Title</label>
                                            <input 
                                                name="title"
                                                value={editTicketData.title}
                                                onChange={(e) => {
                                                    setEditTicketData({...editTicketData, title: e.target.value});
                                                    if (editErrors.title) setEditErrors(prev => ({...prev, title: null}));
                                                }}
                                                onBlur={handleEditBlur}
                                                className={`w-full mt-1 px-3 py-2 text-sm rounded-lg border outline-none transition-all ${
                                                    editErrors.title 
                                                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/30' 
                                                    : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                }`}
                                            />
                                            {editErrors.title && <p className="mt-1 text-[10px] font-medium text-rose-600 uppercase">{editErrors.title}</p>}
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Description</label>
                                            <textarea 
                                                name="description"
                                                value={editTicketData.description}
                                                onChange={(e) => {
                                                    setEditTicketData({...editTicketData, description: e.target.value});
                                                    if (editErrors.description) setEditErrors(prev => ({...prev, description: null}));
                                                }}
                                                onBlur={handleEditBlur}
                                                className={`w-full mt-1 px-3 py-2 text-sm rounded-lg border outline-none transition-all ${
                                                    editErrors.description 
                                                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/30' 
                                                    : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                }`}
                                                rows={3}
                                            />
                                            {editErrors.description && <p className="mt-1 text-[10px] font-medium text-rose-600 uppercase">{editErrors.description}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Priority</label>
                                                <select 
                                                    value={editTicketData.priority}
                                                    onChange={(e) => setEditTicketData({...editTicketData, priority: e.target.value})}
                                                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white"
                                                >
                                                    <option value="LOW">Low</option>
                                                    <option value="MEDIUM">Medium</option>
                                                    <option value="HIGH">High</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-primary uppercase tracking-wider">Contact</label>
                                                <input 
                                                    name="preferredContact"
                                                    value={editTicketData.preferredContact}
                                                    onChange={(e) => {
                                                        setEditTicketData({...editTicketData, preferredContact: e.target.value});
                                                        if (editErrors.preferredContact) setEditErrors(prev => ({...prev, preferredContact: null}));
                                                    }}
                                                    onBlur={handleEditBlur}
                                                    className={`w-full mt-1 px-3 py-2 text-sm rounded-lg border outline-none transition-all ${
                                                        editErrors.preferredContact 
                                                        ? 'border-rose-300 focus:ring-2 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/30' 
                                                        : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                                                    }`}
                                                />
                                                {editErrors.preferredContact && <p className="mt-1 text-[10px] font-medium text-rose-600 uppercase">{editErrors.preferredContact}</p>}
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button 
                                                type="button"
                                                onClick={() => setIsEditingTicket(false)}
                                                className="px-4 py-2 text-xs font-bold text-text-muted hover:text-text-main transition-colors"
                                            >
                                                CANCEL
                                            </button>
                                            <button 
                                                type="submit"
                                                className="px-6 py-2 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all"
                                            >
                                                SAVE CHANGES
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                                        <p className="text-sm text-text-muted">{selectedTicket.description}</p>
                                    </div>
                                )}

                                {selectedTicket.assignedToName && (
                                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                                        <p className="text-xs font-semibold text-emerald-700">Assigned Technician</p>
                                        <p className="text-sm text-emerald-800 mt-0.5">{selectedTicket.assignedToName}</p>
                                    </div>
                                )}

                                {selectedTicket.resolutionNotes && (
                                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
                                        <p className="text-xs font-semibold text-emerald-700">Resolution Update</p>
                                        <p className="text-sm text-emerald-800 mt-0.5">{selectedTicket.resolutionNotes}</p>
                                    </div>
                                )}

                                {selectedTicket.rejectionReason && (
                                    <div className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2">
                                        <p className="text-xs font-semibold text-rose-700">Rejection Reason</p>
                                        <p className="text-sm text-rose-800 mt-0.5">{selectedTicket.rejectionReason}</p>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-sm font-semibold text-text-main flex items-center gap-2">
                                        <Paperclip size={15} /> Attachments
                                    </h4>
                                    {selectedTicket.attachments.length === 0 ? (
                                        <p className="text-xs text-text-light mt-1">No files uploaded.</p>
                                    ) : (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedTicket.attachments.map((file) => (
                                                file.isImage ? (
                                                    <button
                                                        key={file.url}
                                                        type="button"
                                                        title={file.name}
                                                        onClick={() => setLightboxUrl(file.url)}
                                                        className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:border-primary transition-colors shadow-sm"
                                                    >
                                                        <img
                                                            src={file.url}
                                                            alt={file.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                            <span className="text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity px-1 text-center">View</span>
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <a
                                                        key={file.url}
                                                        href={file.url}
                                                        download={file.name}
                                                        title={file.name}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white border border-gray-200 hover:border-primary hover:text-primary text-xs text-text-muted transition-colors"
                                                    >
                                                        <Download size={12} />
                                                        <span className="max-w-30 truncate">{file.name}</span>
                                                    </a>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <TicketComments 
                                        ticketId={getTicketNumericId(selectedTicket.id)} 
                                        ticketStatus={selectedTicket.status}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Lightbox overlay */}
            {lightboxUrl && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setLightboxUrl(null)}
                    onKeyDown={(e) => e.key === 'Escape' && setLightboxUrl(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        type="button"
                        onClick={() => setLightboxUrl(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Close image viewer"
                    >
                        <X size={20} />
                    </button>
                    <img
                        src={lightboxUrl}
                        alt="Attachment preview"
                        className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

        </div>
    )
}

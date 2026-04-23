import React, { useMemo, useState, useEffect } from 'react'
import { MessageSquare, Paperclip, PlusCircle, X, Download, MoreHorizontal } from 'lucide-react'
import { getAllAssets, getAllResourceTypes } from '../../../services/resourceService'

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

    const mapApiComment = (c) => ({
        id: c.commentId,
        author: c.authorName || 'Unknown User',
        message: c.comment || '',
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
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
    const [commentInput, setCommentInput] = useState('')
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [commentSubmitting, setCommentSubmitting] = useState(false)
    const [editingCommentId, setEditingCommentId] = useState(null)
    const [editCommentInput, setEditCommentInput] = useState('')
    const [commentActionId, setCommentActionId] = useState(null)
    const [openCommentMenuId, setOpenCommentMenuId] = useState(null)
    const [commentsError, setCommentsError] = useState('')
    const [formError, setFormError] = useState('')
    const [fileWarning, setFileWarning] = useState('')

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
    }

    const handleFilesChange = (event) => {
        const files = Array.from(event.target.files || [])
        if (files.length > 3) {
            setFileWarning('Only the first 3 images were selected (max 3).')
        } else {
            setFileWarning('')
        }
        setNewFiles(files.slice(0, 3))
    }

    const handleCreateTicket = async (event) => {
        event.preventDefault()
        setFormError('')

        if (!newTicket.title.trim() || !newTicket.description.trim()) {
            setFormError('Title and description are required to create a ticket.')
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
                setFormError(data.message || data.error || 'Failed to create ticket')
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
            setFormError('Network error occurred while submitting ticket')
        }
    }

    const fetchTicketComments = async (ticketId) => {
        const numericTicketId = getTicketNumericId(ticketId)
        if (!numericTicketId) {
            return
        }

        setCommentsLoading(true)
        setCommentsError('')
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${numericTicketId}/comments`, {
                credentials: 'include'
            })
            const data = await response.json()

            if (response.ok && data.success) {
                const commentList = (data.data || []).map(mapApiComment)
                setTickets((prev) => prev.map((ticket) => {
                    if (ticket.id !== ticketId) {
                        return ticket
                    }
                    return {
                        ...ticket,
                        comments: commentList
                    }
                }))
            } else {
                setCommentsError(data.message || 'Failed to load comments')
            }
        } catch (err) {
            console.error('Failed to fetch comments', err)
            setCommentsError('Network error - could not load comments')
        } finally {
            setCommentsLoading(false)
        }
    }

    useEffect(() => {
        if (!selectedTicketId) {
            setCommentsError('')
            setEditingCommentId(null)
            setEditCommentInput('')
            setOpenCommentMenuId(null)
            return
        }
        setEditingCommentId(null)
        setEditCommentInput('')
        setOpenCommentMenuId(null)
        fetchTicketComments(selectedTicketId)
    }, [selectedTicketId])

    const handleAddComment = async (event) => {
        event.preventDefault()
        if (!selectedTicket || !commentInput.trim() || commentSubmitting) {
            return
        }

        const numericTicketId = getTicketNumericId(selectedTicket.id)
        if (!numericTicketId) {
            setCommentsError('Invalid ticket ID')
            return
        }

        setCommentSubmitting(true)
        setCommentsError('')
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${numericTicketId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ comment: commentInput.trim() })
            })
            const data = await response.json()

            if (!response.ok || !data.success) {
                setCommentsError(data.message || 'Failed to post comment')
                return
            }

            const savedComment = mapApiComment(data.data)

            setTickets((prev) => prev.map((ticket) => {
                if (ticket.id !== selectedTicket.id) {
                    return ticket
                }
                return {
                    ...ticket,
                    comments: [...ticket.comments, savedComment]
                }
            }))
            setCommentInput('')
        } catch (error) {
            console.error('Failed to post comment', error)
            setCommentsError('Network error - could not post comment')
        } finally {
            setCommentSubmitting(false)
        }
    }

    const handleStartEditComment = (comment) => {
        setCommentsError('')
        setOpenCommentMenuId(null)
        setEditingCommentId(comment.id)
        setEditCommentInput(comment.message)
    }

    const handleToggleCommentMenu = (commentId) => {
        setOpenCommentMenuId((prev) => (prev === commentId ? null : commentId))
    }

    const handleCancelEditComment = () => {
        setEditingCommentId(null)
        setEditCommentInput('')
    }

    const handleSaveEditComment = async (event) => {
        event.preventDefault()
        if (!selectedTicket || !editingCommentId || !editCommentInput.trim()) {
            return
        }

        const numericTicketId = getTicketNumericId(selectedTicket.id)
        if (!numericTicketId) {
            setCommentsError('Invalid ticket ID')
            return
        }

        setCommentActionId(editingCommentId)
        setCommentsError('')
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${numericTicketId}/comments/${editingCommentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ comment: editCommentInput.trim() })
            })
            const data = await response.json()

            if (!response.ok || !data.success) {
                setCommentsError(data.message || 'Failed to update comment')
                return
            }

            const updatedComment = mapApiComment(data.data)
            setTickets((prev) => prev.map((ticket) => {
                if (ticket.id !== selectedTicket.id) {
                    return ticket
                }
                return {
                    ...ticket,
                    comments: ticket.comments.map((comment) =>
                        comment.id === updatedComment.id ? updatedComment : comment
                    )
                }
            }))

            setEditingCommentId(null)
            setEditCommentInput('')
            setOpenCommentMenuId(null)
        } catch (error) {
            console.error('Failed to update comment', error)
            setCommentsError('Network error - could not update comment')
        } finally {
            setCommentActionId(null)
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!selectedTicket) {
            return
        }

        const numericTicketId = getTicketNumericId(selectedTicket.id)
        if (!numericTicketId) {
            setCommentsError('Invalid ticket ID')
            return
        }

        setCommentActionId(commentId)
        setCommentsError('')
        setOpenCommentMenuId(null)
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${numericTicketId}/comments/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            const data = await response.json()

            if (!response.ok || !data.success) {
                setCommentsError(data.message || 'Failed to delete comment')
                return
            }

            setTickets((prev) => prev.map((ticket) => {
                if (ticket.id !== selectedTicket.id) {
                    return ticket
                }
                return {
                    ...ticket,
                    comments: ticket.comments.filter((comment) => comment.id !== commentId)
                }
            }))

            if (editingCommentId === commentId) {
                setEditingCommentId(null)
                setEditCommentInput('')
            }
        } catch (error) {
            console.error('Failed to delete comment', error)
            setCommentsError('Network error - could not delete comment')
        } finally {
            setCommentActionId(null)
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
                                placeholder="Projector not turning on"
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-text-muted">Category</label>
                            <select
                                name="category"
                                value={newTicket.category}
                                onChange={handleNewInputChange}
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            >
                                {resourceTypes.map((type) => (
                                    <option key={type.id} value={type.name}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-text-muted">Resource</label>
                            <select
                                name="resourceId"
                                value={newTicket.resourceId}
                                onChange={handleNewInputChange}
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                disabled={!newTicket.category}
                            >
                                {allAssets.filter(r => r.type?.name === newTicket.category).map((resource) => (
                                    <option key={resource.id} value={resource.id}>
                                        {resource.name} {resource.location && `(${resource.location.name})`}
                                    </option>
                                ))}
                            </select>
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
                                placeholder="Describe the issue clearly..."
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium text-text-muted">Preferred Contact (Optional)</label>
                            <input
                                name="preferredContact"
                                type="tel"
                                value={newTicket.preferredContact}
                                onChange={handleNewInputChange}
                                placeholder="+94 xxx xxxx"
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
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
                                className="mt-1 block w-full text-xs text-text-muted file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-primary/10 file:text-primary"
                            />
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

                        {formError && <p className="text-xs text-red-600">{formError}</p>}
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
                                    <span className={`text-xs px-2.5 py-1 rounded border w-fit ${STATUS_STYLES[selectedTicket.status]}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>

                                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                                    <p className="text-sm text-text-muted">{selectedTicket.description}</p>
                                </div>

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

                                <div>
                                    <h4 className="text-sm font-semibold text-text-main flex items-center gap-2">
                                        <MessageSquare size={15} /> Comments
                                    </h4>

                                    <div className="mt-2 space-y-2 min-h-40 max-h-56 overflow-y-auto pr-1">
                                        {commentsLoading && (
                                            <p className="text-xs text-text-light">Loading comments...</p>
                                        )}
                                        {!commentsLoading && selectedTicket.comments.length === 0 && (
                                            <p className="text-xs text-text-light">No comments yet.</p>
                                        )}
                                        {selectedTicket.comments.map((comment) => (
                                            <div key={comment.id} className="bg-white border border-gray-200 rounded-md p-2.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-text-main">{comment.author}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] text-text-light">
                                                            {formatDateTime(comment.createdAt)}
                                                            {comment.updatedAt && comment.updatedAt !== comment.createdAt ? ' • edited' : ''}
                                                        </span>
                                                        {editingCommentId !== comment.id && (
                                                            <div className="relative">
                                                                <button
                                                                    type="button"
                                                                    aria-label="Comment actions"
                                                                    onClick={() => handleToggleCommentMenu(comment.id)}
                                                                    disabled={commentActionId === comment.id}
                                                                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-text-light hover:bg-gray-100 hover:text-text-main"
                                                                >
                                                                    <MoreHorizontal size={14} />
                                                                </button>

                                                                {openCommentMenuId === comment.id && (
                                                                    <div className="absolute right-0 mt-1 w-28 rounded-md border border-gray-200 bg-white py-1 shadow-lg z-10">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleStartEditComment(comment)}
                                                                            className="block w-full px-3 py-1.5 text-left text-xs text-text-main hover:bg-gray-50"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDeleteComment(comment.id)}
                                                                            className="block w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {editingCommentId === comment.id ? (
                                                    <form onSubmit={handleSaveEditComment} className="mt-2 space-y-2">
                                                        <textarea
                                                            rows={3}
                                                            value={editCommentInput}
                                                            onChange={(event) => setEditCommentInput(event.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                                            disabled={commentActionId === comment.id}
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={commentActionId === comment.id || !editCommentInput.trim()}
                                                                className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-hover"
                                                            >
                                                                {commentActionId === comment.id ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleCancelEditComment}
                                                                disabled={commentActionId === comment.id}
                                                                className="px-3 py-1.5 rounded-md border border-gray-200 text-xs text-text-muted hover:border-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <p className="text-sm text-text-muted mt-1">{comment.message}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {commentsError && <p className="text-xs text-red-600 mt-2">{commentsError}</p>}

                                    <form onSubmit={handleAddComment} className="mt-3 flex gap-2">
                                        <input
                                            value={commentInput}
                                            onChange={(event) => setCommentInput(event.target.value)}
                                            placeholder="Add a comment..."
                                            disabled={commentSubmitting}
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                        <button
                                            type="submit"
                                            disabled={commentSubmitting}
                                            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover"
                                        >
                                            {commentSubmitting ? 'Posting...' : 'Post'}
                                        </button>
                                    </form>
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

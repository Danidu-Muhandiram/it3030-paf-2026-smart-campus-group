import React, { useMemo, useState } from 'react'
import { MessageSquare, Paperclip, PlusCircle } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'

// workflow shown to end users.
const WORKFLOW = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']

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

const CATEGORY_OPTIONS = [
    { value: 'HARDWARE', label: 'Hardware' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'NETWORK', label: 'Network' }
]

const RESOURCE_OPTIONS = [
    { value: 'PROJECTOR_LAB_B202_21', label: 'Projector #21 - Lab B202', location: 'Lab B202' },
    { value: 'AC_DISCUSSION_04', label: 'AC Unit - Discussion Room 04', location: 'Discussion Room 04' },
    { value: 'WHITEBOARD_HALL_A', label: 'Smart Whiteboard - Hall A', location: 'Hall A' },
    { value: 'NETWORK_SW_C3', label: 'Network Switch - Block C3', location: 'Block C3' }
]

export const TicketsPage = () => {
    const { user } = useAuth()

    // Local mock state for UI prototyping; will replace with API-backed state when endpoint is ready.
    const [tickets, setTickets] = useState([
        {
            id: 'TCK-1002',
            title: 'AC leaking water',
            description: 'Water drip near the AC unit in Discussion Room 04.',
            location: 'Discussion Room 04',
            priority: 'HIGH',
            status: 'OPEN',
            createdAt: '2026-04-12T05:15:00.000Z',
            attachments: ['ac_leak.jpg', 'floor_spot.jpg'],
            comments: []
        }
    ])

    const [filter, setFilter] = useState('ALL')
    const [selectedTicketId, setSelectedTicketId] = useState('TCK-1002')
    const [commentInput, setCommentInput] = useState('')
    const [formError, setFormError] = useState('')
    const [fileWarning, setFileWarning] = useState('')

    const [newTicket, setNewTicket] = useState({
        title: '',
        category: 'HARDWARE',
        resourceId: 'PROJECTOR_LAB_B202_21',
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
        setNewTicket((prev) => ({
            ...prev,
            [name]: value
        }))
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

    const handleCreateTicket = (event) => {
        event.preventDefault()
        setFormError('')

        if (!newTicket.title.trim() || !newTicket.description.trim()) {
            setFormError('Title and description are required to create a ticket.')
            return
        }

        const selectedResource = RESOURCE_OPTIONS.find((resource) => resource.value === newTicket.resourceId)

        // Generate temporary ID client-side for demo flow.
        const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`
        const createdTicket = {
            id: newId,
            title: newTicket.title.trim(),
            description: newTicket.description.trim(),
            location: selectedResource?.location || '',
            category: newTicket.category,
            resourceId: newTicket.resourceId,
            resourceLabel: selectedResource?.label || '',
            priority: newTicket.priority,
            preferredContact: newTicket.preferredContact.trim(),
            status: 'OPEN',
            createdAt: new Date().toISOString(),
            attachments: newFiles.map((file) => file.name),
            comments: []
        }

        setTickets((prev) => [createdTicket, ...prev])
        setSelectedTicketId(createdTicket.id)
        setNewTicket({
            title: '',
            category: 'HARDWARE',
            resourceId: 'PROJECTOR_LAB_B202_21',
            description: '',
            priority: 'MEDIUM',
            preferredContact: ''
        })
        setNewFiles([])
        setFileWarning('')
    }

    const handleAddComment = (event) => {
        event.preventDefault()
        if (!selectedTicket || !commentInput.trim()) {
            return
        }

        // Append comment locally to mimic threaded updates.
        const newComment = {
            id: `c-${Date.now()}`,
            author: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'You',
            message: commentInput.trim(),
            createdAt: new Date().toISOString()
        }

        setTickets((prev) => prev.map((ticket) => {
            if (ticket.id !== selectedTicket.id) {
                return ticket
            }
            return {
                ...ticket,
                comments: [...ticket.comments, newComment]
            }
        }))
        setCommentInput('')
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
                                {CATEGORY_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
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
                            >
                                {RESOURCE_OPTIONS.map((resource) => (
                                    <option key={resource.value} value={resource.value}>
                                        {resource.label}
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
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
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
                            {filteredTickets.length === 0 && (
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

                                <div>
                                    <h4 className="text-sm font-semibold text-text-main flex items-center gap-2">
                                        <Paperclip size={15} /> Attachments
                                    </h4>
                                    {selectedTicket.attachments.length === 0 ? (
                                        <p className="text-xs text-text-light mt-1">No images uploaded.</p>
                                    ) : (
                                        <ul className="mt-2 flex flex-wrap gap-2 text-xs text-text-muted">
                                            {selectedTicket.attachments.map((file) => (
                                                <li key={file} className="px-2.5 py-1 rounded-md bg-white border border-gray-200">
                                                    {file}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-text-main flex items-center gap-2">
                                        <MessageSquare size={15} /> Comments
                                    </h4>

                                    <div className="mt-2 space-y-2 max-h-36 overflow-y-auto pr-1">
                                        {selectedTicket.comments.length === 0 && (
                                            <p className="text-xs text-text-light">No comments yet.</p>
                                        )}
                                        {selectedTicket.comments.map((comment) => (
                                            <div key={comment.id} className="bg-white border border-gray-200 rounded-md p-2.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-text-main">{comment.author}</span>
                                                    <span className="text-[11px] text-text-light">{formatDateTime(comment.createdAt)}</span>
                                                </div>
                                                <p className="text-sm text-text-muted mt-1">{comment.message}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <form onSubmit={handleAddComment} className="mt-3 flex gap-2">
                                        <input
                                            value={commentInput}
                                            onChange={(event) => setCommentInput(event.target.value)}
                                            placeholder="Add a comment..."
                                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover"
                                        >
                                            Post
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

        </div>
    )
}

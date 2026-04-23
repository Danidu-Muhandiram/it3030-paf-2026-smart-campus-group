import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Edit2, Trash2, X, Check, Lock } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { commentService } from '../services/commentService';

export const TicketComments = ({ ticketId, ticketStatus }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const isClosed = ticketStatus === 'CLOSED' || ticketStatus === 'REJECTED';

    const fetchComments = useCallback(async () => {
        if (!ticketId) return;
        setLoading(true);
        try {
            const res = await commentService.getComments(ticketId);
            if (res.success) setComments(res.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    }, [ticketId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleAdd = async (e) => {
        if (e) e.preventDefault();
        if (!newComment.trim() || submitting || isClosed) return;
        setSubmitting(true);
        try {
            const res = await commentService.addComment(ticketId, newComment.trim());
            if (res.success) {
                setNewComment('');
                fetchComments();
            } else {
                alert(res.message || 'Failed to add comment');
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            alert('Error adding comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleUpdate = async (commentId) => {
        if (!editValue.trim() || isClosed) return;
        try {
            const res = await commentService.updateComment(ticketId, commentId, editValue.trim());
            if (res.success) {
                setEditingId(null);
                fetchComments();
            }
        } catch (err) {
            console.error('Error updating comment:', err);
        }
    };

    const handleDelete = async (commentId) => {
        if (isClosed) return;
        if (!window.confirm('Delete this comment?')) return;
        try {
            const res = await commentService.deleteComment(ticketId, commentId);
            if (res.success) fetchComments();
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-text-light uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={16} /> Comments ({comments.length})
                </h3>
                {isClosed && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        <Lock size={10} /> THREAD CLOSED
                    </span>
                )}
            </div>

            {/* List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {comments.length === 0 ? (
                    <p className="text-xs text-text-muted italic">No comments yet.</p>
                ) : (
                    comments.map((c) => (
                        <div key={c.commentId} className="bg-gray-50 rounded-lg p-3 border border-gray-100 group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-primary">{c.authorName}</span>
                                <span className="text-[10px] text-text-light">{new Date(c.createdAt).toLocaleString()}</span>
                            </div>
                            
                            {editingId === c.commentId ? (
                                <div className="space-y-2 mt-2">
                                    <textarea
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-full text-sm p-2 rounded border border-gray-200 focus:ring-1 focus:ring-primary outline-none"
                                        rows={2}
                                        autoFocus
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-text-muted hover:bg-gray-100 rounded border border-gray-200 transition-all">
                                            <X size={10}/> Cancel
                                        </button>
                                        <button onClick={() => handleUpdate(c.commentId)} className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 rounded border border-emerald-200 transition-all">
                                            <Check size={10}/> Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-text-main whitespace-pre-wrap">{c.comment}</p>
                                    {!isClosed && user?.email === c.authorEmail && (
                                        <div className="flex gap-2 justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { setEditingId(c.commentId); setEditValue(c.comment); }} 
                                                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/10 rounded border border-primary/20 transition-all"
                                            >
                                                <Edit2 size={10} /> EDIT
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(c.commentId)} 
                                                className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded border border-rose-100 transition-all"
                                            >
                                                <Trash2 size={10} /> DELETE
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            {!isClosed ? (
                <form onSubmit={handleAdd} className="flex gap-2 items-center bg-white border border-gray-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a comment..."
                        className="flex-1 text-sm p-1 px-2 outline-none resize-none bg-transparent"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || submitting}
                        className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-sm shrink-0"
                    >
                        <Send size={16} className={submitting ? 'animate-pulse' : ''} />
                    </button>
                </form>
            ) : (
                <div className="flex items-center justify-center p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-xs text-text-muted flex items-center gap-2">
                        <Lock size={12} /> This ticket is closed. New comments cannot be added.
                    </p>
                </div>
            )}
        </div>
    );
};

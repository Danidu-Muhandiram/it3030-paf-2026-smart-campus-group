const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

export const commentService = {
    async getComments(ticketId) {
        const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${ticketId}/comments`, {
            credentials: 'include'
        });
        return response.json();
    },

    async addComment(ticketId, commentText) {
        const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${ticketId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ comment: commentText })
        });
        return response.json();
    },

    async updateComment(ticketId, commentId, commentText) {
        const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${ticketId}/comments/${commentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ comment: commentText })
        });
        return response.json();
    },

    async deleteComment(ticketId, commentId) {
        const response = await fetch(`${API_BASE_URL}/api/v1/tickets/${ticketId}/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return response.json();
    }
};

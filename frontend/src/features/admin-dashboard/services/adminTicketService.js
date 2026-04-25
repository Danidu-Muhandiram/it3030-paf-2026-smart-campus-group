import axios from '../../../services/axios';

const API_URL = '/v1/tickets/admin';

// Service functions for admin ticket management (fetching, updating status, assigning technicians)
export const getAllTickets = async () => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
};

// Admin can assign the ticket to a technician, which changes the status to IN_PROGRESS
export const assignTicket = async (ticketId) => {
    const response = await axios.put(`${API_URL}/${ticketId}/assign`);
    return response.data;
};

// Admin can update the ticket status to RESOLVED, CLOSED, or REJECTED with optional notes/reason
export const updateTicketStatus = async (ticketId, statusData) => {
    // statusData = { status, resolutionNotes, rejectionReason }
    const response = await axios.put(`${API_URL}/${ticketId}/status`, statusData);
    return response.data;
};

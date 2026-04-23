import axios from '../../../services/axios';

const API_URL = '/v1/tickets/admin';

export const getAllTickets = async () => {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
};

export const assignTicket = async (ticketId) => {
    const response = await axios.put(`${API_URL}/${ticketId}/assign`);
    return response.data;
};

export const updateTicketStatus = async (ticketId, statusData) => {
    // statusData = { status, resolutionNotes, rejectionReason }
    const response = await axios.put(`${API_URL}/${ticketId}/status`, statusData);
    return response.data;
};

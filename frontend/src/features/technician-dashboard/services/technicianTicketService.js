import axios from '../../../services/axios';

const API_URL = '/v1/tickets/technician';

export const getMyAssignedTickets = async () => {
    const response = await axios.get(`${API_URL}/my`);
    return response.data;
};

export const startTicketProgress = async (ticketId) => {
    const response = await axios.put(`${API_URL}/${ticketId}/start`);
    return response.data;
};

export const resolveTicket = async (ticketId, resolutionNotes) => {
    const response = await axios.put(`${API_URL}/${ticketId}/resolve`, { resolutionNotes });
    return response.data;
};

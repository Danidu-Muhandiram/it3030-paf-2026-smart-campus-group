import axiosInstance from './axios';

/**
 * Fetches the user dashboard summary (counts for resources, bookings, and tickets).
 * @returns {Promise<{totalResources: number, myBookings: number, openTickets: number}>}
 */
export const getDashboardSummary = () =>
    axiosInstance.get('/v1/dashboard/summary').then((r) => r.data.data);

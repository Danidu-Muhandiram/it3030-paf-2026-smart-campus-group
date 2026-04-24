import axiosInstance from '../../services/axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085'

export const authService = {
    register: async (payload) => {
        // Local signup endpoint; backend returns Set-Cookie for auth_token.
        const response = await axiosInstance.post('/auth/public/register', payload)
        return response.data
    },

    login: async (payload) => {
        // Local login endpoint for email/password authentication.
        const response = await axiosInstance.post('/auth/public/login', payload)
        return response.data
    },

    startGoogleLogin: () => {
        // OAuth start with full page navigation (not axios/fetch).
        window.location.href = `${apiBaseUrl}/oauth2/authorization/google`
    },

    fetchCurrentUser: async () => {
        // Cookie is sent automatically via axios withCredentials.
        const response = await axiosInstance.get('/auth/me')
        return response.data
    },

    logout: async () => {
        // Server responds with Set-Cookie to expire auth_token.
        await axiosInstance.post('/auth/logout')
    },

    updateProfile: async (payload) => {
        const response = await axiosInstance.patch('/auth/me', payload)
        return response.data
    }
}

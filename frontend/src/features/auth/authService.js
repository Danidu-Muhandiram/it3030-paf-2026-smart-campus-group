import axiosInstance from '../../services/axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085'

export const authService = {
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
    }
}

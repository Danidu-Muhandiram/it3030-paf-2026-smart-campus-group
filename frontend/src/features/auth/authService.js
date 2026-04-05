import axiosInstance from '../../services/axios'

export const authService = {
    startGoogleLogin: () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google'
    },

    setToken: (token) => {
        localStorage.setItem('auth_token', token)
    },

    getToken: () => {
        return localStorage.getItem('auth_token')
    },

    fetchCurrentUser: async () => {
        const response = await axiosInstance.get('/auth/me')
        return response.data
    },

    logout: () => {
        localStorage.removeItem('auth_token')
    }
}

import axiosInstance from '../../services/axios'

// Example structure for Auth Services
export const authService = {
    login: async (credentials) => {
        // const response = await axiosInstance.post('/auth/login', credentials)
        // return response.data
    },

    register: async (userData) => {
        // const response = await axiosInstance.post('/auth/register', userData)
        // return response.data
    },

    logout: () => {
        // localStorage.removeItem('token')
    }
}

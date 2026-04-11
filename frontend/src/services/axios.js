import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085'

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL: `${apiBaseUrl}/api`,
    withCredentials: true,
})

export default axiosInstance

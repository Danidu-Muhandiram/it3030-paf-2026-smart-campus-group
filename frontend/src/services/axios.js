import axios from 'axios'

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosInstance

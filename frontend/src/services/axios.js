import axios from 'axios'

// Create Axios Instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
})

export default axiosInstance

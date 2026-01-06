import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})
// handle token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    config.headers["Content-Type"] = "application/json"
    return config
}, (error) => {
    return Promise.reject(error)
})

export default api

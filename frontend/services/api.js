import axios from "axios";
import useAuthStore from "../src/store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry ) {
      originalRequest._retry = true
      try {
         const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
       const accessToken = response.data.token
        useAuthStore.getState().login(accessToken, null)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }

    }
    return Promise.reject(error)

  }

)

export default api;

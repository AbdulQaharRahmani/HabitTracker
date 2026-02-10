import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-data");

    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      const token = state?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

import axios from "axios";

// Default API Base URL (Spring Boot Backend)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 6000
});

// Request Interceptor: Attach JWT Token if available
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session expired or unauthorized request.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
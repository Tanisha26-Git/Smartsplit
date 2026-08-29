import axios from "axios";

// Single Axios instance for the whole app. Every request goes to the
// SmartSplit backend under /api.
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor: if we have a JWT saved from login/signup, attach it
// as a Bearer token so protected backend routes accept the request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

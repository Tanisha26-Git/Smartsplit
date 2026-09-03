import axios from "axios";
import { logout } from "../utils/auth";

// API origin comes from VITE_API_URL in production (e.g. the Render backend
// URL), falling back to the local dev server. We append "/api" here so the
// env var is just the origin.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Single Axios instance for the whole app. Every request goes to the
// SmartSplit backend under /api.
const api = axios.create({
  baseURL: `${API_URL}/api`,
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

// Response interceptor: if the token is missing/expired the backend replies
// 401. Clear the stale session and bounce to /login so the user re-authenticates
// instead of seeing a raw "token failed" error inside the page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

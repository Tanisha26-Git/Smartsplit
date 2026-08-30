import axios from "axios";
import { logout } from "../utils/auth";

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

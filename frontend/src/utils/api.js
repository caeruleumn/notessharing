import axios from "axios";

// Use NEXT_PUBLIC_API_URL when available (Next.js exposes env vars prefixed with NEXT_PUBLIC_ to the browser)
// Fallback to localhost:8080 for local development outside Docker.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

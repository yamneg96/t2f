import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("t2f_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("t2f_token");
      localStorage.removeItem("t2f_user");
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth API ─────────────────────────────────────

export const authApi = {
  signup: (data: { fullName: string; email: string; password: string }) =>
    api.post("/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ── Convert API ──────────────────────────────────

export const convertApi = {
  convert: (data: { html: string; source: string; sourceLabel?: string; viewport?: { width: number; height: number } }) =>
    api.post("/convert", data),
};

// ── History API ──────────────────────────────────

export const historyApi = {
  list: (page = 1, pageSize = 12) =>
    api.get(`/history?page=${page}&pageSize=${pageSize}`),
  detail: (id: string) => api.get(`/history/${id}`),
};

// ── Settings API ─────────────────────────────────

export const settingsApi = {
  get: () => api.get("/settings"),
  update: (data: Record<string, unknown>) => api.put("/settings", data),
};

// ── Checkout API ─────────────────────────────────

export const checkoutApi = {
  stripe: (data: { plan: string; billingCycle?: string }) =>
    api.post("/checkout/stripe", data),
  screenshot: (formData: FormData) =>
    api.post("/checkout/screenshot", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  adminListPayments: (page = 1, status?: string) =>
    api.get(`/checkout/payments?page=${page}${status ? `&status=${status}` : ""}`),
  adminVerify: (id: string, data: { status: string; adminNote?: string }) =>
    api.put(`/checkout/payments/${id}/verify`, data),
};

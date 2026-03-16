// src/api/projectApi.jsx
import axios from "axios";

const BASE = "https://project-employee-tracker.onrender.com";

// ── Token helpers ────────────────────────────────────────────────────────────
export const saveToken = (token) => localStorage.setItem("token", token);
export const getToken  = ()      => localStorage.getItem("token");

// ── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Auto-attach token ────────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Global error logger ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg    = err?.response?.data?.message || err.message;
    console.error(`API Error [${status}]:`, msg);
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const loginUser = (data) => api.post("/api/auth/login", data);

// ── Projects ─────────────────────────────────────────────────────────────────
export const getAllProjects  = ()          => api.get("/api/projects");
export const getProjectById = (id)        => api.get(`/api/projects/${id}`);
export const createProject  = (data)      => api.post("/api/projects", data);
export const updateProject  = (id, data)  => api.put(`/api/projects/${id}`, data);
export const deleteProject  = (id)        => api.delete(`/api/projects/${id}`);

// ── Employees (for dropdowns) ───────────────────────────────────────────────
export const getAllEmployees = () => api.get("/api/ddls/employees");

// ── Clients (for dropdowns) ─────────────────────────────────────────────────
export const getAllClients   = () => api.get("/api/ddls/clients");  
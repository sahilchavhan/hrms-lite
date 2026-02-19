import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://hrms-lite-kifz.onrender.com/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            const message =
                error.response.data?.message ||
                error.response.data?.error ||
                "An error occurred";
            error.userMessage = message;
            error.details = error.response.data?.details || {};
        } else if (error.request) {
            error.userMessage =
                "Unable to connect to the server. Please ensure the backend is running.";
        } else {
            error.userMessage = "An unexpected error occurred.";
        }
        return Promise.reject(error);
    }
);

// ── Employee API ──────────────────────────────────────────────

export const employeeAPI = {
    getAll: (params = {}) => api.get("/employees/", { params }),

    getById: (id) => api.get(`/employees/${id}/`),

    create: (data) => api.post("/employees/", data),

    delete: (id) => api.delete(`/employees/${id}/`),

    getDepartments: () => api.get("/employees/departments/"),

    getStats: () => api.get("/employees/stats/"),

    search: (query) => api.get("/employees/", { params: { search: query } }),
};

// ── Attendance API ────────────────────────────────────────────

export const attendanceAPI = {
    getAll: (params = {}) => api.get("/attendance/", { params }),

    create: (data) => api.post("/attendance/", data),

    delete: (id) => api.delete(`/attendance/${id}/`),

    bulkMark: (data) => api.post("/attendance/bulk_mark/", data),

    getByEmployee: (employeeId) =>
        api.get("/attendance/by_employee/", {
            params: { employee_id: employeeId },
        }),
};

export default api;

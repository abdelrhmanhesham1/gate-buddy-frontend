import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://gate-buddy-backend-production-f6df.up.railway.app/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach JWT from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── 401 handling: try one silent refresh, then retry; otherwise clear session ──
const AUTH_SKIP = ["/users/login", "/users/signup", "/users/refresh"];
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || "";

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !AUTH_SKIP.some((u) => url.includes(u))
    ) {
      original._retry = true;
      try {
        // De-dupe concurrent refreshes
        refreshing =
          refreshing ||
          axios.post(`${BASE_URL}/users/refresh`, {}, { withCredentials: true });
        const r = await refreshing;
        refreshing = null;
        const newToken = r.data?.token;
        if (newToken) {
          localStorage.setItem("auth_token", newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(original);
      } catch (e) {
        refreshing = null;
        // Refresh failed → session is dead. Clear and let the app redirect.
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_profile");
        if (!window.location.pathname.includes("/login")) {
          window.dispatchEvent(new Event("gb:session-expired"));
        }
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (email, password) => api.post("/users/login", { email, password }),
  signup: (name, email, password, passwordConfirm) =>
    api.post("/users/signup", { name, email, password, passwordConfirm }),
  logout: () => api.post("/users/logout"),
  refresh: () => api.post("/users/refresh"),
  forgotPassword: (email) =>
    api.post(
      "/users/forgotPassword",
      { email },
      { headers: { "x-client-type": "mobile" } }
    ),
  verifyResetCode: (email, code) =>
    api.post("/users/verifyResetCode", { email, code }),
  // Uses the stored reset session; pass a token to use the /:token route form.
  resetPassword: (password, passwordConfirm, token) =>
    token
      ? api.patch(`/users/resetPassword/${token}`, { password, passwordConfirm })
      : api.patch("/users/resetPassword", { password, passwordConfirm }),
  googleLogin: (idToken) => api.post("/users/google", { idToken }),
  githubLogin: (code) => api.post("/users/github", { code }),
  facebookLogin: (accessToken) => api.post("/users/facebook", { accessToken }),
};

// ── User profile ──────────────────────────────────────────────────────────────
export const userAPI = {
  getMe: () => api.get("/users/me"),
  // `data` may be a plain object (JSON) or FormData (multipart, for photo upload).
  updateMe: (data) => {
    const isForm = typeof FormData !== "undefined" && data instanceof FormData;
    return api.patch("/users/updateMe", data, {
      headers: isForm ? { "Content-Type": "multipart/form-data" } : undefined,
    });
  },
  updatePreferences: (preferences) =>
    api.patch("/users/updateMe", { preferences }),
  updatePassword: (passwordCurrent, password, passwordConfirm) =>
    api.patch("/users/updateMyPassword", {
      passwordCurrent,
      password,
      passwordConfirm,
    }),
  deleteMe: () => api.delete("/users/deleteMe"),
};

// ── Flights ───────────────────────────────────────────────────────────────────
export const flightAPI = {
  getAll: (params = {}) => api.get("/flights", { params }),
  getUpdated: (params = {}) => api.get("/flights/updated", { params }),
  getById: (id) => api.get(`/flights/${id}`),
  getUpdates: (id) => api.get(`/flights/${id}/updates`),
  getMyFlight: () => api.get("/flights/my-flight"),
  track: (id, reminderMinutes) =>
    api.post(`/flights/${id}/track`, { reminderMinutes }),
  cancelTrack: (id) => api.patch(`/flights/${id}/cancel-track`),
  scanBoardingPass: (barcodeData) => api.post("/flights/scan", { barcodeData }),
};

// ── Home dashboard ─────────────────────────────────────────────────────────────
export const homeAPI = {
  getDashboard: () => api.get("/home"),
};

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (message, history = []) =>
    api.post("/chat/query", { message, history }),
};

// ── Notifications ──────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll: (params = {}) => api.get("/notifications", { params }),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};

// ── Services ──────────────────────────────────────────────────────────────────
export const servicesAPI = {
  getAll: (category) =>
    api.get("/services", { params: { category, limit: 200 } }),
  getById: (id) => api.get(`/services/${id}`),
  search: (q) => api.get("/services/search", { params: { q } }),
  nearby: (lng, lat, distance) =>
    api.get("/services/nearby", { params: { lng, lat, distance } }),
  countersStats: () => api.get("/services/counters/stats"),
};

// ── FAQ ───────────────────────────────────────────────────────────────────────
// NOTE: GET /faqs nests the array under res.data.data.data
export const faqAPI = {
  getAll: (params = {}) => api.get("/faqs", { params: { limit: 100, ...params } }),
  getById: (id) => api.get(`/faqs/${id}`),
};

// ── Stats ─────────────────────────────────────────────────────────────────────
export const statsAPI = {
  getStats: () => api.get("/stats"),
  rate: (rating, review) => api.post("/stats/rate", { rating, review }),
};

export default api;

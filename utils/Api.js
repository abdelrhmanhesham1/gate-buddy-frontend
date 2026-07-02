import axios from "axios";

const BASE_URL = "https://gate-buddy-backend-production-f6df.up.railway.app/api/v1";

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

// Auth helpers
export const authAPI = {
  login: (email, password) => api.post("/users/login", { email, password }),
  signup: (name, email, password, passwordConfirm) =>
    api.post("/users/signup", { name, email, password, passwordConfirm }),
  logout: () => api.post("/users/logout"),
  forgotPassword: (email) =>
    api.post("/users/forgotPassword", { email }, { headers: { "x-client-type": "mobile" } }),
  verifyResetCode: (email, code) => api.post("/users/verifyResetCode", { email, code }),
  resetPassword: (password, passwordConfirm) =>
    api.patch("/users/resetPassword", { password, passwordConfirm }),
  googleLogin: (idToken) => api.post("/users/google", { idToken }),
  githubLogin: (code) => api.post("/users/github", { code }),
  facebookLogin: (accessToken) => api.post("/users/facebook", { accessToken }),
};

// User profile helpers
export const userAPI = {
  getMe: () => api.get("/users/me"),
  updateMe: (data) => api.patch("/users/updateMe", data),
  updatePassword: (passwordCurrent, password, passwordConfirm) =>
    api.patch("/users/updateMyPassword", { passwordCurrent, password, passwordConfirm }),
};

// Flight helpers
export const flightAPI = {
  getUpdated: () => api.get("/flights/updated"),
  getMyFlight: () => api.get("/flights/my-flight"),
  scanBoardingPass: (barcodeData) => api.post("/flights/scan", { barcodeData }),
};

// Home dashboard
export const homeAPI = {
  getDashboard: () => api.get("/home"),
};

// Chat
export const chatAPI = {
  sendMessage: (message, history = []) => api.post("/chat/query", { message, history }),
};

// Notifications
export const notificationsAPI = {
  getAll: () => api.get("/notifications"),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};

// Services
export const servicesAPI = {
  getAll: (category) => api.get("/services", { params: { category, limit: 100 } }),
  search: (q) => api.get("/services/search", { params: { q } }),
};

// FAQ
export const faqAPI = {
  getAll: () => api.get("/faqs"),
};

// Stats
export const statsAPI = {
  getStats: () => api.get("/stats"),
};

export default api;

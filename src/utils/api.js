import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:9000/api";

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const getTokenExpiration = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null;  
  } catch (error) {
    return null;
  }
};

// Theo dõi hoạt động của user
let lastActivityTime = Date.now();
const updateUserActivity = () => (lastActivityTime = Date.now());

window.addEventListener("mousemove", updateUserActivity);
window.addEventListener("keydown", updateUserActivity);
window.addEventListener("click", updateUserActivity);
window.addEventListener("scroll", updateUserActivity);

const isUserActive = () => Date.now() - lastActivityTime < 5 * 60 * 1000; // 5 phút

// Làm mới token khi sắp hết hạn
const refreshAccessToken = async () => {
  if (!isUserActive()) {
    return false;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      api.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
      return true;
    }
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    return false;
  }
};

// Kiểm tra và làm mới token nếu cần
const ensureValidAccessToken = async () => {
  const expiration = getTokenExpiration();
  if (!expiration) return;

  const now = Date.now();
  const timeRemaining = expiration - now;

  if (timeRemaining < 2 * 60 * 1000) {
    await refreshAccessToken();
  }
};

// Tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  // Loại bỏ Content-Type mặc định để tránh ghi đè
});

// Interceptor cho request
api.interceptors.request.use(
  async (config) => {
    await ensureValidAccessToken();
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Chỉ đặt Content-Type nếu chưa được đặt và không phải FormData
    if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const success = await refreshAccessToken();
      if (success) {
        originalRequest.headers["Authorization"] = `Bearer ${getAccessToken()}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
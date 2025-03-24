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
    console.log(" Access Token Expiry:", new Date(decoded.exp * 1000).toLocaleTimeString());
    return decoded.exp ? decoded.exp * 1000 : null;  
  } catch (error) {
    console.error(" Lỗi giải mã token:", error);
    return null;
  }
};

// Theo dõi hoạt động của user (nếu không hoạt động quá 5 phút thì không làm mới token)
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
    console.warn("User không hoạt động, bỏ qua refresh token.");
    return false;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.error(" Không tìm thấy refresh token.");
    return false;
  }

  try {
    console.log("Đang làm mới accessToken...");
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      api.defaults.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
      console.log(" Token đã được làm mới.");
      return true;
    }
  } catch (error) {
    console.error(" Không thể làm mới token:", error.response?.data || error.message);
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
    console.warn(" Token sắp hết hạn, làm mới...");
    await refreshAccessToken();
  }
};

// Tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// **Interceptor cho request** (tự động thêm token trước khi gửi request)
api.interceptors.request.use(
  async (config) => {
    await ensureValidAccessToken();
    const token = getAccessToken();

    console.log(" Gửi request:", config.url);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log(" Đã thêm token vào headers.");
    } else {
      console.warn(" Không tìm thấy accessToken!");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// **Interceptor cho response** (tự động refresh token nếu gặp lỗi `401 Unauthorized`)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn(" Token có thể đã hết hạn. Thử làm mới...");
      originalRequest._retry = true;

      const success = await refreshAccessToken();
      if (success) {
        originalRequest.headers["Authorization"] = `Bearer ${getAccessToken()}`;
        return api(originalRequest);
      }
    }

    console.error(" API lỗi:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

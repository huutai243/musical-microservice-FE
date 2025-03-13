import axios from 'axios';
import { jwtDecode } from "jwt-decode";
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const getTokenExpiration = () => {
    const token = getAccessToken();
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp ? decoded.exp * 1000 : null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

//Check user còn thao tác trên web vào 5 phút cuối trước khi accessToken hết hạn
let lastActivityTime = Date.now();
const updateUserActivity = () => lastActivityTime = Date.now();
window.addEventListener('mousemove', updateUserActivity);
window.addEventListener('keydown', updateUserActivity);
window.addEventListener('click', updateUserActivity);
window.addEventListener('scroll', updateUserActivity);

const isUserActive = () => (Date.now() - lastActivityTime) < 5 * 60 * 1000; // 2 phút
const refreshAccessToken = async () => {
    if (!isUserActive()) {
        console.warn('User inactive, skipping token refresh');
        return false; // Không làm mới nếu user không hoạt động
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        console.error('No refresh token available');
        return false;
    }

    try {
        const response = await axios.post('http://localhost:9000/api/auth/refresh', { refreshToken });

        if (response.data.accessToken) {
            // Lưu token mới vào localStorage
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            // Cập nhật headers mặc định
            api.defaults.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            return true;
        }
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return false;
    }
};

const ensureValidAccessToken = async () => {
    const expiration = getTokenExpiration();
    if (!expiration) return;

    const now = Date.now();
    const timeRemaining = expiration - now;

    // Nếu token sắp hết hạn (dưới 2 phút) và user vẫn đang hoạt động, làm mới token
    if (timeRemaining < 2*60 * 1000) {
        await refreshAccessToken();
    }
};

const api = axios.create({
    baseURL: 'http://localhost:9000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

//Thêm accessToken vào headers trước khi gửi request
api.interceptors.request.use(
    async (config) => {
        await ensureValidAccessToken(); 
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//Xử lý refresh token khi bị 401 (Unauthorized)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const success = await refreshAccessToken();

            if (success) {
                originalRequest.headers['Authorization'] = `Bearer ${getAccessToken()}`;
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

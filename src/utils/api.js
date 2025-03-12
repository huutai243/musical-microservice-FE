import axios from 'axios';

// Lấy token từ localStorage 
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Tạo một instance của Axios
const api = axios.create({
    baseURL: 'http://localhost:9000/api', //apigateway
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm accessToken vào headers
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý refresh token khi bị 401
api.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 (Unauthorized) 
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = getRefreshToken();

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Gửi request refresh token 
                const refreshResponse = await axios.post(
                    'http://localhost:9000/api/auth/refresh',
                    { refreshToken } 
                );

                // Lưu Access Token mới
                localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

                // Cập nhật token mới 
                api.defaults.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh Token failed:', refreshError);
                // Nếu refresh thất bại, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

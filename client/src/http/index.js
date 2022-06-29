import axios from "axios";

/* Базовий URL сервера */
export const API_URL = 'http://localhost:3001'

/* Базові налоштування axios */
const $api = axios.create({
    withCredentials: true, // Підвантажує cookie
    baseURL: API_URL
})

/* Для кожного запиту встановлює headers.Authorization */
$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
});

/* Для кожної відповіді перевіряє статус код 401 та відправляє запит на оновлення токену */
$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e) {
            console.log('Не авторизований');
        }

    }
    throw error;
})

export default $api;
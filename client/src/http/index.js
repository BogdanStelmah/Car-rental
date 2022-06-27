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

export default $api;
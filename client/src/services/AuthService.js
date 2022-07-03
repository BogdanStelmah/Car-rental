import $api, {API_URL} from "../http";
import axios from "axios";

export default class AuthService {
    static async login(email, password) {
        const response = await $api.post('user/login', {email, password});
        await localStorage.setItem('token', response.data.user.accesToken);
        return response;
    }

    static async registration(email, password, confirmPassword) {
        const response =await $api.post('user/register', {email, password, confirmPassword});
        await localStorage.setItem('token', response.data.user.accesToken);
        return response;
    }

    static async logout() {
        return await $api.post('user/logout');
    }

    static async checkAuth() {
        const response = await axios.get(`${API_URL}/user/refresh`, { withCredentials: true });
        await localStorage.setItem('token', response.data.user.accesToken);
        return response;
    }
 }
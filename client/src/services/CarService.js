import $api from "../http";

export class CarService {
    static async fetchCars(params) {
        const response = await $api({
            method: 'get',
            url: 'car',
            params: params
        });
        return response?.data;
    }
}
import $api from "../http";

export default class CarTypeService {
    static async fetchCarTypes(params) {
        const response = await $api({
            method: 'get',
            url: 'carType',
            params: params
        });
        return response?.data;
    }

    static async deleteCarType(id) {
        const response = await $api({
            method: 'delete',
            url: `carType/${id}`,
        });
        return response?.data;
    }

    static async editCarType(id, data) {
        const response = await $api({
            method: 'put',
            url: `carType/${id}`,
            data: data
        });
        return response?.data;
    }

    static async createCarType(data) {
        const response = await $api({
            method: 'post',
            url: `carType`,
            data: data
        });
        return response?.data;
    }
}
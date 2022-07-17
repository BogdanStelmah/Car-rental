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
}
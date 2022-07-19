import $api from "../http";

export default class RentalService {
    static async fetchRentals(params) {
        const response = await $api({
            method: 'get',
            url: 'rental',
            params: params
        });
        return response?.data;
    }

    static async createRental(data) {
        const response = await $api({
            method: 'post',
            url: `rental`,
            data: data
        });
        return response?.data;
    }

    static async deleteRental(id) {
        const response = await $api({
            method: 'delete',
            url: `rental/${id}`,
        });
        return response?.data;
    }

    static async endRental(id) {
        const response = await $api({
            method: 'put',
            url: `rental/${id}`,
        });
        return response?.data;
    }
}
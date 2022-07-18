import $api from "../http";

export default class RentalService {
    static async createRental(data) {
        const response = await $api({
            method: 'post',
            url: `rental`,
            data: data
        });
        return response?.data;
    }
}
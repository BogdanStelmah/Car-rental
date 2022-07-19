import $api from "../http";

export class ReviewsService {
    static async fetchReviewsCar(idCar) {
        const response = await $api({
            method: 'get',
            url: `car/${idCar}/review`,
        });
        return response?.data;
    }

    static async addReviewCar(idCar, data) {
        const response = await $api({
            method: 'post',
            url: `car/${idCar}/review`,
            data: data
        });
        return response?.data;
    }
}
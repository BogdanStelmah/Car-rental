import $api from "../http";

export class ReviewsService {
    static async fetchReviewsCar(idCar) {
        const response = await $api({
            method: 'get',
            url: `car/${idCar}/review`,
        });
        return response?.data;
    }
}
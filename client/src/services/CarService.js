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

    static async fetchCar(id) {
        const response = await $api({
            method: 'get',
            url: `car/${id}`
        });
        return response?.data;
    }

    static async createCars(data) {
        const response = await $api({
            method: 'post',
            url: `car`,
            data: data
        });
        return response?.data;
    }

    static async deleteCar(id) {
        const response = await $api({
            method: 'delete',
            url: `car/${id}`
        });
        return response?.data;
    }

    static async editCar(id, data) {
        const response = await $api({
            method: 'put',
            url: `car/${id}`,
            data: data
        });
        return response?.data;
    }

    static async addPhotos(id, data) {
        const response = await $api({
            method: 'post',
            url: `carImage/${id}`,
            data: data
        });
        return response?.data;
    }

    static async deletePhoto(idCar, idImage) {
        const response = await $api({
            method: 'delete',
            url: `carImage/${idCar}/${idImage}`,
        });
        return response?.data;
    }

    static async fetchColors() {
        const response = await $api({
            method: 'get',
            url: `car/colors`,
        });
        return response?.data;
    }
}
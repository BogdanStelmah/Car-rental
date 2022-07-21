import $api from "../http";

export default class PasswordDataService {
    static async editPassportDataToUser(id, data) {
        const response = await $api({
            method: 'post',
            url: `passport/${id}`,
            data: data
        });
        return response?.data;
    }

    static async editPassportData(id, data) {
        const response = await $api({
            method: 'put',
            url: `passport/${id}`,
            data: data
        });
        return response?.data;
    }

    static async fetchPassportData(params) {
        const response = await $api({
            method: 'get',
            url: `passport`,
            params: params
        });
        return response?.data;
    }

    static async deletePassportData(id) {
        const response = await $api({
            method: 'delete',
            url: `passport/${id}`,
        });
        return response?.data;
    }

    static async createPassportData(data) {
        const response = await $api({
            method: 'post',
            url: `passport`,
            data: data
        });
        return response?.data;
    }

    static async fetchPassportDataById(id) {
        const response = await $api({
            method: 'get',
            url: `passport/${id}`
        });
        return response?.data;
    }

    static async addPhotos(id, data) {
        const response = await $api({
            method: 'post',
            url: `passport/photos/${id}`,
            data: data
        });
        return response?.data;
    }

    static async deletePhoto(idPassport, idImage) {
        const response = await $api({
            method: 'delete',
            url: `passport/${idPassport}/photos/${idImage}`,
        });
        return response?.data;
    }
}
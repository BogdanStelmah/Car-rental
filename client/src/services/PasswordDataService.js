import $api from "../http";

export default class PasswordDataService {
    static async editPassportData(id, data) {
        const response = await $api({
            method: 'post',
            url: `passport/${id}`,
            data: data
        });
        return response?.data;
    }
}
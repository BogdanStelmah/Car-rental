import $api from "../http";

export default class DBService {
    static async getCollectionSizes() {
        const response = await $api({
            method: 'get',
            url: `mongo/statistics`,
        });
        return response?.data;
    }

    static async restoreDatabase() {
        const response = await $api({
            method: 'post',
            url: `mongo/restore`,
        });
        return response?.data;
    }

    static async dumpDatabase() {
        const response = await $api({
            method: 'post',
            url: `mongo/dump`,
        });
        return response?.data;
    }
}
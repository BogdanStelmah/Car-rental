import $api from "../http";

export default class UserService {
    static async fetchUsers(params) {
        const response = await $api({
            method: 'get',
            url: 'user',
            params: params
        });
        return response?.data;
    }

    static async deleteUser(id) {
        const response = await $api({
            method: 'delete',
            url: `user/${id}`
        })
        return response?.data;
    }

    static async editUser(id, data) {
        const response = await $api({
            method: 'put',
            url: `user/${id}`,
            data: {
                email: data.email,
                is_superuser: data.is_superuser,
            }
        })
        return response?.data;
    }
}
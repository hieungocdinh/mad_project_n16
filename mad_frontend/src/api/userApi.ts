// api/userApi.ts
import request from "./config";
import CommonResponse from "../types/response/common-response";
import UserResponse from "../types/response/user-response";

class UserApi {
    public async searchUsers(username: string = "", page: number = 0, size: number = 10) {
        const response = await request.get<CommonResponse<any>>("/user/search", {
            params: {
                username,
                page,
                size,
                isDeleted: 0,
            },
        });
        return response.data;
    }

    public async getUser(userId: number) {
        const response = await request.get<CommonResponse<UserResponse>>(`/user/${userId}`);
        return response.data;
    }

    public async deleteUser(userId: number) {
        const response = await request.delete<CommonResponse<any>>(`/user/${userId}`);
        return response.data;
    }

    public async saveUser(data: { id?: number; username: string; email: string }) {
        const response = await request.post<CommonResponse<any>>("/user/save", data);
        return response.data;
    }
    public async getUsersWithoutFamily() {
        const response = await request.get<CommonResponse<any>>('/user/without-family');
        return response.data;
    }
}

export default new UserApi();

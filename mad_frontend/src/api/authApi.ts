import LoginRequest from "../types/request/login-request";
import RegisterRequest from "../types/request/register-requet";
import CommonResponse from "../types/response/common-response";

import request from "./config";
import UserResponse from "../types/response/user-response";

class AuthApi {
    public async login(loginRequest: LoginRequest) {
        const response = await request.post<CommonResponse<String>>('/auth/login', loginRequest);
        return response.data;
    }

    public async register(registerRequest: RegisterRequest) {
        const response = await request.post<CommonResponse<String>>('/auth/register', registerRequest);
        return response.data;
    }

    public async forgotPassword(email: string) {
        const response = await request.post<CommonResponse<String>>('/auth/forgot-password', {email});
        return response.data;
    }

    public async resetPassword(email: string, password: string) {
        const response = await request.post<CommonResponse<String>>('/auth/reset-password', {email, password});
        return response.data;
    }

    public async changePassword(email: string, oldPassword: string, newPassword: string) {
        const response = await request.post<CommonResponse<String>>('/auth/change-password', {email, oldPassword, newPassword});
        return response.data;
    }

    public async getCurrentUser() {
        const response = await request.get<CommonResponse<UserResponse>>('/auth/current-user');
        return response.data.data;
    }
}

export default new AuthApi();
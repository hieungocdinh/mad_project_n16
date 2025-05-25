import request from "./config";

import ProfileRequest from "../types/request/profile-request";

import CommonResponse from "../types/response/common-response";
import ProfileResponse from "../types/response/profile-response";

class ProfileApi {
    public async createProfile(bodyRequest: ProfileRequest) {
        const response = await request.post<CommonResponse<string>>('/profiles/create', bodyRequest);
        return response.data;
    }

    public async getListProfile(familyId: number) {
        const response = await request.get<CommonResponse<ProfileResponse[]>>(`/profiles/get-list/${familyId}`);
        return response.data;
    }

    public async getProfileDetail(profileId: number) {
        const response = await request.get<CommonResponse<ProfileResponse>>(`/profiles/get-detail/${profileId}`);
        return response.data;
    }

    public async updateProfile(profileId: number, bodyRequest: ProfileRequest) {
        const response = await request.put<CommonResponse<string>>(`/profiles/update/${profileId}`, bodyRequest);
        return response.data;
    }
}

export default new ProfileApi();
import request from "./config";
import FamilyRequest from "../types/request/family-request";
import CommonResponse from "../types/response/common-response";
import FamilyResponse from "../types/response/family-response";

class FamilyApi{
    public async searchFamilies(name: string = "", page: number = 0, size: number = 10) {
        const response = await request.get<CommonResponse<any>>("/family/search", {
            params: {
                name,
                page,
                size
            }
        });
        return response.data;
    }

    public async getFamilyById(familyId: number) {
        const response = await request.get<CommonResponse<FamilyResponse>>(`/family/${familyId}`);
        return response.data;
    }

    public async createFamily(familyRequest: FamilyRequest) {
        const response = await request.post<CommonResponse<FamilyResponse>>("/family/create", familyRequest);
        return response.data;
    }

    public async updateFamily(familyId: number, familyRequest: FamilyRequest) {
        const response = await request.post<CommonResponse<FamilyResponse>>(`/family`, familyRequest, {
            params: {
                familyId
            }
        });
        return response.data;
    }

    public async deleteFamily(familyId: number) {
        const response = await request.delete<CommonResponse<string>>(`/family`, {
            params: {
                familyId
            }
        });
        return response.data;
    }

    public async suggestFamiliesForUser(userId: number) {
        const response = await request.get<CommonResponse<any>>(`/family/suggest-for-user/${userId}`);
        return response.data;
    }

    
}

export default new FamilyApi();
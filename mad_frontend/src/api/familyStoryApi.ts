import FamilyStoryResponse from "../types/response/family-story-response";
import {FamilyStoryRequest} from "../types/request/family-story-request";
import CommonResponse from "../types/response/common-response";
import Page from "../types/response/common-response";

import request from "./config";



class FamilyStoryApi {
    public async getAllFamilyStories() {
        const response = await request.get<CommonResponse<FamilyStoryResponse[]>>('/familyStory/list');
        return response.data;
    }

    public async getAllFamilyStoriesByUserId(userId: number) {
        const response = await request.get<CommonResponse<FamilyStoryResponse[]>>(`/familyStory/list-by-user/${userId}`);
        return response.data;
    }

    public async createFamilyStory(familyStoryRequest: FamilyStoryRequest) {
        const response = await request.post<CommonResponse<FamilyStoryResponse>>('/familyStory/', familyStoryRequest);
        return response.data;
    }

    public async getFamilyStoryById(id: number) {
        const response = await request.get<CommonResponse<FamilyStoryResponse>>(`/familyStory/${id}`);
        return response.data;
    }

    public async updateFamilyStory(id: number, familyStoryRequest: FamilyStoryRequest) {
        const response = await request.put<CommonResponse<FamilyStoryResponse>>(`/familyStory/update/${id}`, familyStoryRequest);
        return response.data;
    }

    public async deleteFamilyStory(id: number) {
        const response = await request.delete<CommonResponse<string>>(`/familyStory/${id}`);
        return response.data;
    }

    public async searchFamilyStory(username?: string, title?: string) {
        let url = '/family-story/search?';

        if (username) {
            url += `username=${encodeURIComponent(username)}&`;
        }

        if (title) {
            url += `title=${encodeURIComponent(title)}`;
        }

        const response = await request.get<CommonResponse<FamilyStoryResponse[]>>(url);
        return response.data;
    }

    public async searchStoriesWithPaging(
        username?: string,
        title?: string,
        page: number = 0,
        size: number = 4
    ) {
        let url = `/familyStory/search-with-paging?page=${page}&size=${size}`;

        if (username) {
            url += `&username=${encodeURIComponent(username)}`;
        }

        if (title) {
            url += `&title=${encodeURIComponent(title)}`;
        }

        const response = await request.get<CommonResponse<Page<FamilyStoryResponse>>>(url);
        return response.data;
    }
    public async getAllFamilyStoriesWithPaging(page: number = 0, size: number = 4) {
        const url = `/familyStory/get-all-by-page?page=${page}&size=${size}`;
        const response = await request.get<CommonResponse<Page<FamilyStoryResponse>>>(url);
        return response.data;
    }
}

export default new FamilyStoryApi();
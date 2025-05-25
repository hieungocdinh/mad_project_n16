import request from "./config";

import AlbumRequest from "../types/request/album-request";
import DeleteImageRequest from "../types/request/delete-image-request";

import CommonResponse from "../types/response/common-response";
import AlbumResponse from "../types/response/album-response";

class AlbumApi {
    public async createAlbum(familyId: number, requestBody: AlbumRequest) {
        const response = await request.post<CommonResponse<string>>(`/albums/create/${familyId}`, requestBody);
        return response.data;
    }

    public async getListAlbum(familyId: number) {
        const response = await request.get<CommonResponse<AlbumResponse[]>>(`/albums/get-list/${familyId}`);
        return response.data;
    }

    public async getAlbumDetail(albumId: number) {
        const response = await request.get<CommonResponse<AlbumResponse>>(`/albums/get-detail/${albumId}`);
        return response.data;
    }

    public async updateAlbum(albumId: number, requestBody: AlbumRequest) {
        const response = await request.put<CommonResponse<string>>(`/albums/update/${albumId}`, requestBody);
        return response.data;
    }

    public async deleteImageInAlbum(listImageId: number[], albumId?: number) {
        if (!albumId) {
            throw new Error("Album ID is required when deleting images from an album");
        }
        const requestBody: DeleteImageRequest[] = listImageId.map(id => ({ id }));
        const response = await request.delete<CommonResponse<string>>(`/albums/delete-images/${albumId}`, { data: requestBody });
        return response.data;
    }

    public async deleteAlbum(albumId: number) {
        const response = await request.delete<CommonResponse<string>>(`/albums/delete/${albumId}`);
        return response.data;
    }
}

export default new AlbumApi();  
import request from "./config";

import DeleteImageRequest from "../types/request/delete-image-request";

import CommonResponse from "../types/response/common-response";
import ImageResponse from "../types/response/image-response";

class ImageApi {
    public async createImages(familyId: number, imagesUrl: string[]) {
        const requestBody = imagesUrl.map(url => ({ url }));
        const response = await request.post<CommonResponse<ImageResponse[]>>(`/images/create/${familyId}`, requestBody);
        return response.data;
    }

    public async getListImage(familyId: number) {
        const response = await request.get<CommonResponse<{ [key: string]: ImageResponse[] }>>(`/images/get-list/${familyId}`);
        return response.data;
    }

    public async getListImageForAlbum(familyId: number, albumId?: number, isInAlbum?: boolean) {
        let url = `/images/get-list-for-album/${familyId}`;
        if (albumId !== undefined) {
            url += `?albumId=${albumId}`;
        }
        if (isInAlbum !== undefined) {
            url += albumId ? `&isInAlbum=${isInAlbum}` : `?isInAlbum=${isInAlbum}`;
        }
        const response = await request.get<CommonResponse<ImageResponse[]>>(url);
        return response.data;
    }

    public async getImageDetail(imageId: number) {
        const response = await request.get<CommonResponse<ImageResponse>>(`/images/get-detail/${imageId}`);
        return response.data;
    }

    public async deleteImage(listImageId: number[]) {
        const requestBody: DeleteImageRequest[] = listImageId.map(id => ({ id }));
        const response = await request.delete<CommonResponse<string>>(`/images/delete-images`, { data: requestBody });
        return response.data;
    }

}

export default new ImageApi();  
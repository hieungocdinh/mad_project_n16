import ImageResponse from "./image-response";

export default interface AlbumResponse {
    id: number;
    albumName: string;
    coverImageUrl: string;
    createdAt: string;
    totalImages: number;
    images?: ImageResponse[];
}
export interface AlbumImageRequest {
    id: number;
}

export default interface AlbumRequest {
    albumName?: string;
    coverImageUrl?: string;
    images?: AlbumImageRequest[];
}
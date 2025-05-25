import User from "../model/user";
import AlbumRequest from "./album-request";
import ImageRequest from "./image-request";

export default interface FamilyRequest {
    name: string;
    avatarUrl: string | null;
    husband: User | null;
    wife: User | null;
    childIds?: number[];
    albums?: AlbumRequest[];
    images?: ImageRequest[];
}
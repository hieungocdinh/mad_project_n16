import UserResponse from "./user-response";

export default interface FamilyResponse {
    id: number;
    name: string;
    avatarUrl: string;
    husband: UserResponse,
    wife: UserResponse,
    childIds: number[];
    familyTreeIds: number[];
    familyStatus: string;
}
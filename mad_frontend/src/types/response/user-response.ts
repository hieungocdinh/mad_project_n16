export default interface UserResponse {
    userId: number;
    username: string;
    email: string;
    roles: string[];
    familyIds: number[];
    profileId: number;
}
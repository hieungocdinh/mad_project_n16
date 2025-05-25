export default interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
    familyIds: number[];
    profileId: number;
    avatarUrl: string;
}
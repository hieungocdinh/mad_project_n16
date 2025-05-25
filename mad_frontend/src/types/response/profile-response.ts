export default interface ProfileResponse {
    id: number;
    userId: number;
    fullName: string;
    firstName?: string;
    lastName?: string;
    gender: string;
    age?: number;
    birthDate?: string;
    deathDate?: string;
    biography?: string;
    address?: string;
    avatarUrl: string;
    profileSetting: boolean;
    relations?: { [key: string]: any };
}
export default interface ProfileRequest {
    firstName?: string;
    lastName?: string;
    gender?: string;
    birthDate?: string;
    deathDate?: string | null;
    biography?: string;
    address?: string;
    avatarUrl?: string;
    profileSetting?: boolean;
}
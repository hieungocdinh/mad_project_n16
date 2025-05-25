import User from "./user";
import {FamilyStatus} from "./family-status";

export default interface Family {
    id: number;
    name: string;
    avatarUrl: string;
    husband: User;
    wife: User;
    childIds: number[];
    status?: FamilyStatus;
}
import FamilyTreeFamily from "../model/familyTree-family";

export default interface FamilyTreeRequest {
    id?: number;
    name?: string;
    age?: number;
    family?: FamilyTreeFamily[];
    generationNumbers?: number;
    avatarUrl?: string;
}

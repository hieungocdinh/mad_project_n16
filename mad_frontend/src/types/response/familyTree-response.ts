
import FamilyTreeFamilyResponse from "./familyTree-family-response";

export default interface FamilyTreeResponse {
    id: number;
    families: FamilyTreeFamilyResponse[];
    name: string;
    generationNumbers: number;
    age: number;
    avatarUrl: string;
}
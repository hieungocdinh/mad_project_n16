import FamilyResponse from "./response/family-response";
import Person from "./model/person";

export type FamilyTreeDetailTabParam = {
    FamilyTreeInfo: {
        familyTreeId: number;
    };
    FamilyTreeEdit: {
        familyTreeId: number;
    };
    ManageUser: undefined;
    FamilySelect: undefined | {
        onSelect: (family: FamilyResponse) => void;
        generationIdx: number;
    }
    FamilyStats: {
        persons: Person[];
    }

};
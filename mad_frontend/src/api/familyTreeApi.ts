import FamilyTreeRequest from "../types/request/familyTree-request";
import request from "./config";

class FamilyTreeApi {
    public async getListFamilyTree(familyTreeRequest: FamilyTreeRequest) {
        const response = await request.post('/family-tree/list', familyTreeRequest);
        return response.data;
    }

    public async getFamilyTreeDetail(familyTreeId: number) {
        const response = await request.get(`/family-tree/${familyTreeId}`);
        return response.data;
    }

    public async saveFamilyTree(familyTreeRequest: FamilyTreeRequest) {
        const response = await request.post('/family-tree/save', familyTreeRequest);
        return response.data;
    }

    public async saveAllFamilyTrees(familyTreeRequests: FamilyTreeRequest[]) {
        const response = await request.post('/family-tree/save-all', familyTreeRequests);
        return response.data;
    }

    public async deleteFamilyTree(familyTreeId: number) {
        const response = await request.delete(`/family-tree/${familyTreeId}`);
        return response.data;
    }
}

export default new FamilyTreeApi();
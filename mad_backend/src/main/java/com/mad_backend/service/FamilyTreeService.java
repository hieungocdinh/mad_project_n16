package com.mad_backend.service;

import com.mad_backend.dto.entity.FamilyTree;
import com.mad_backend.dto.request.FamilyTreeRequest;
import com.mad_backend.dto.response.CommonResponse;
import com.mad_backend.dto.response.FamilyTreeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FamilyTreeService {
    List<FamilyTreeResponse> getListFamilyTrees(FamilyTreeRequest familyTreeRequest);

    FamilyTreeResponse getFamilyTree(Long id);

    FamilyTreeResponse saveFamilyTree(FamilyTreeRequest familyTreeRequest);

    List<FamilyTreeResponse> saveAllFamilyTrees(List<FamilyTreeRequest> requests);

    void deleteFamilyTree(Long id);
}

package com.mad_backend.controller;

import com.mad_backend.dto.request.FamilyTreeRequest;
import com.mad_backend.dto.response.CommonResponse;
import com.mad_backend.dto.response.FamilyTreeResponse;
import com.mad_backend.service.FamilyTreeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/family-tree")
@RequiredArgsConstructor
public class FamilyTreeController {

    private final FamilyTreeService familyTreeService;

    @PostMapping("/list")
    public ResponseEntity<CommonResponse<List<FamilyTreeResponse>>> list(@RequestBody FamilyTreeRequest request) {
        List<FamilyTreeResponse> response = familyTreeService.getListFamilyTrees(request);
        return ResponseEntity.ok(new CommonResponse<>(200, "Get family trees successfully!", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommonResponse<FamilyTreeResponse>> getFamilyTree(@PathVariable Long id) {
        FamilyTreeResponse response = familyTreeService.getFamilyTree(id);
        return ResponseEntity.ok(new CommonResponse<>(200, "Get family tree successfully!", response));
    }

    @PostMapping("/save")
    public ResponseEntity<CommonResponse<FamilyTreeResponse>> saveFamilyTree(@RequestBody FamilyTreeRequest request) {
        FamilyTreeResponse savedFamilyTrees = familyTreeService.saveFamilyTree(request);
        return ResponseEntity.ok(new CommonResponse<>(200, "Save all family trees successfully!", savedFamilyTrees));
    }

    @PostMapping("/save-all")
    public ResponseEntity<CommonResponse<List<FamilyTreeResponse>>> saveAllFamilyTrees(@RequestBody List<FamilyTreeRequest> requests) {
        List<FamilyTreeResponse> familyTreeResponses = familyTreeService.saveAllFamilyTrees(requests);
        return ResponseEntity.ok(new CommonResponse<>(200, "Save all family trees successfully!", familyTreeResponses));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CommonResponse<?>> deleteFamilyTree(@PathVariable Long id) {
        familyTreeService.deleteFamilyTree(id);
        return ResponseEntity.ok(new CommonResponse<>(200, "Deleted family tree successfully!", null));
    }
}

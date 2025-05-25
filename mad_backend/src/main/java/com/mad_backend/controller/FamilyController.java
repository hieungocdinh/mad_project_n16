package com.mad_backend.controller;

import com.mad_backend.dto.request.FamilyRequest;
import com.mad_backend.dto.response.CommonResponse;
import com.mad_backend.dto.response.FamilyResponse;
import com.mad_backend.service.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/family")
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyService familyService;

    @GetMapping("/search")
    public ResponseEntity<CommonResponse<Page<FamilyResponse>>> searchFamilies(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FamilyResponse> result = familyService.searchFamiliesByName(name, pageable);
        return ResponseEntity.ok(new CommonResponse<>(200, "Search with paging success", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommonResponse<FamilyResponse>> findFamilyById(@PathVariable Long id) {
        FamilyResponse response = familyService.getFamilyById(id);
        return ResponseEntity.ok(new CommonResponse<>(200, "Family found successfully", response));
    }


    @PostMapping("/create")
    public ResponseEntity<CommonResponse<FamilyResponse>> createFamily(@RequestBody FamilyRequest request) {
        FamilyResponse response = familyService.createFamily(request);
        return ResponseEntity.ok(new CommonResponse<>(200, "Family created successfully", response));
    }

    @PostMapping()
    public ResponseEntity<CommonResponse<FamilyResponse>> updateFamily(
            @RequestParam("familyId") Long familyId,
            @RequestBody FamilyRequest request) {
        FamilyResponse response = familyService.updateFamily(familyId, request);
        return ResponseEntity.ok(new CommonResponse<>(200, "Family updated successfully", response));
    }

    @DeleteMapping
    public ResponseEntity<CommonResponse<String>> deleteFamily(@RequestParam("familyId") Long familyId) {
        familyService.deleteFamily(familyId);
        return ResponseEntity.ok(new CommonResponse<>(200, "Family deleted successfully", null));
    }

    @GetMapping("/suggest-for-user/{userId}")
    public ResponseEntity<CommonResponse<List<String>>> suggestFamiliesForUser(@PathVariable Long userId) {
        List<String> suggestions = familyService.suggestFamiliesForUser(userId);
        return ResponseEntity.ok(new CommonResponse<>(200, "Suggest families successfully", suggestions));
    }

}

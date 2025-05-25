package com.mad_backend.controller;

import com.mad_backend.dto.request.FamilyStoryRequest;
import com.mad_backend.dto.response.CommonResponse;
import com.mad_backend.dto.response.FamilyStoryResponse;

import com.mad_backend.service.FamilyStoryService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/familyStory")
@RequiredArgsConstructor
public class FamilyStoryController {
    private final FamilyStoryService familyStoryService;
    // Add methods to handle family story related requests here
    @GetMapping("/list")
    public ResponseEntity<CommonResponse<List<FamilyStoryResponse>>> getAllFamilyStories() {
        List<FamilyStoryResponse> familyStoryResponses = familyStoryService.getAllFamilyStories();
        return ResponseEntity.ok(new CommonResponse<>(200, "Get all family stories successfully!", familyStoryResponses));
    }
    @GetMapping("/list-by-user/{userId}")
    public ResponseEntity<CommonResponse<List<FamilyStoryResponse>>> getAllFamilyStoriesByUserId(@PathVariable Long userId) {
        List<FamilyStoryResponse> familyStoryResponses = familyStoryService.getAllFamilyStoriesByUserId(userId);
        return ResponseEntity.ok(new CommonResponse<>(200, "Get all family stories by user id successfully!", familyStoryResponses));
    }
    @PostMapping("/")
    public ResponseEntity<CommonResponse<FamilyStoryResponse>> createFamilyStores(@RequestBody FamilyStoryRequest familyStoryRequest) {
        FamilyStoryResponse familyStoryResponse = familyStoryService.createFamilyStory(familyStoryRequest);
        return ResponseEntity.ok(new CommonResponse<>(201, "Create family story successfully!", familyStoryResponse));
    }
    @GetMapping("/{id}")
    public ResponseEntity<CommonResponse<FamilyStoryResponse>> getFamilyStoryById(@PathVariable Long id) {
        FamilyStoryResponse familyStoryResponse = familyStoryService.getFamilyStoryById(id);
        return ResponseEntity.ok(new CommonResponse<>(200, "Get family story by id successfully!", familyStoryResponse));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<CommonResponse<FamilyStoryResponse>> updateFamilyStory(@PathVariable Long id, @RequestBody FamilyStoryRequest familyStoryRequest) {
        FamilyStoryResponse familyStoryResponse = familyStoryService.updateFamilyStory(id, familyStoryRequest);
        return ResponseEntity.ok(new CommonResponse<>(200, "Update family story successfully!", familyStoryResponse));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<CommonResponse<String>> deleteFamilyStory(@PathVariable Long id) {
        familyStoryService.deleteFamilyStory(id);
        return ResponseEntity.ok(new CommonResponse<>(200, "Delete family story successfully!", null));
    }
    @GetMapping("/search")
    public ResponseEntity<CommonResponse<List<FamilyStoryResponse>>> searchFamilyStory(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String title) {
        List<FamilyStoryResponse> familyStoryResponses = familyStoryService.searchFamilyStory(username, title);
        return ResponseEntity.ok(new CommonResponse<>(200, "Search family story successfully!", familyStoryResponses));
    }

    @GetMapping("/search-with-paging")
    public ResponseEntity<CommonResponse<Page<FamilyStoryResponse>>> searchStories(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        Page<FamilyStoryResponse> familyStoryResponses = familyStoryService.searchStories(username, title, page, size);
        return ResponseEntity.ok(new CommonResponse<>(200, "Search family story with paging successfully!", familyStoryResponses));
    }
    @GetMapping("/get-all-by-page")
    public ResponseEntity<CommonResponse<Page<FamilyStoryResponse>>> getAllFamilyByPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        Page<FamilyStoryResponse> familyStoryResponses = familyStoryService.getAllFamilyStories(page, size);
        return ResponseEntity.ok(new CommonResponse<>(200, "Get all family story with paging successfully!", familyStoryResponses));
    }
}

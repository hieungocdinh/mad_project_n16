package com.mad_backend.service;

import com.mad_backend.dto.entity.FamilyStory;
import com.mad_backend.dto.request.FamilyStoryRequest;
import com.mad_backend.dto.response.FamilyResponse;
import com.mad_backend.dto.response.FamilyStoryResponse;
import com.mad_backend.service.impl.FamilyStoryServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FamilyStoryService {
    // Define the methods that will be implemented in the service class
    FamilyStoryResponse createFamilyStory(FamilyStoryRequest familyStoryRequest);

    FamilyStoryResponse getFamilyStoryById(Long id);

    List<FamilyStoryResponse> getAllFamilyStoriesByUserId(Long userId);

    List<FamilyStoryResponse> getAllFamilyStories();

    FamilyStoryResponse updateFamilyStory(Long id, FamilyStoryRequest familyStory);

    void deleteFamilyStory(Long familyStoryId);

//    Page<FamilyStoryResponse> searchFamilyStory();
    List<FamilyStoryResponse> searchFamilyStory(String username, String title);


    Page<FamilyStoryResponse> searchStories(String username, String title, int page, int size);

    Page<FamilyStoryResponse> getAllFamilyStories(int page, int size);
}
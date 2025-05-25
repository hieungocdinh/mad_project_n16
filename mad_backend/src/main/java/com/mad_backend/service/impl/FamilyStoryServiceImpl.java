package com.mad_backend.service.impl;


import com.mad_backend.dto.entity.FamilyStory;
import com.mad_backend.dto.entity.User;
import com.mad_backend.dto.request.FamilyStoryRequest;
import com.mad_backend.dto.response.FamilyStoryResponse;
import com.mad_backend.dto.response.UserResponse;
import com.mad_backend.repository.FamilyStoryRepository;
import com.mad_backend.repository.UserRepository;
import com.mad_backend.security.custom.CustomUserDetails;
import com.mad_backend.service.FamilyStoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
@Component
@RequiredArgsConstructor
public class FamilyStoryServiceImpl implements FamilyStoryService {

    private final FamilyStoryRepository familyStoryRepository;
    // Add your service methods here

    private final UserRepository userRepository;

    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new SecurityException("User not authenticated!");
        }

        return getUserResponse((CustomUserDetails) authentication.getPrincipal());
    }
    private UserResponse getUserResponse(CustomUserDetails principal) {
        UserResponse userResponse = new UserResponse();
        userResponse.setUserId(principal.getUserId());
        userResponse.setEmail(principal.getEmail());
        userResponse.setRoles(principal.getRoles());
        return userResponse;
    }

    @Override
    public FamilyStoryResponse createFamilyStory(FamilyStoryRequest familyStoryRequest) {
        FamilyStory familyStory = new FamilyStory();
        User currentUser = userRepository.findById(getCurrentUser().getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + getCurrentUser().getUserId()));
        familyStory.setUser(currentUser);
        familyStory.setTitle(familyStoryRequest.getTitle());
        familyStory.setContent(familyStoryRequest.getContent());
        familyStory.setStoryAvatar(familyStoryRequest.getStoryAvatar());
        familyStory.setCoverImage(familyStoryRequest.getCoverImage());
        FamilyStory savedFamilyStory = familyStoryRepository.save(familyStory);
        return FamilyStoryResponse.fromEntity(savedFamilyStory);
    }
    @Override
    public FamilyStoryResponse getFamilyStoryById(Long id){
        return familyStoryRepository.findById(id)
                .map(FamilyStoryResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("Family story not found with ID: " + id));
    };
    
    @Override
    public List<FamilyStoryResponse> getAllFamilyStoriesByUserId(Long userId)
    {
        return familyStoryRepository.findAllByUserId(userId)
                .stream()
                .map(FamilyStoryResponse::fromEntity)
                .toList();
    };
    
    @Override
    public List<FamilyStoryResponse> getAllFamilyStories(){
        return familyStoryRepository.findAll()
                .stream()
                .map(FamilyStoryResponse::fromEntity)
                .toList();
    };

    @Override
    public FamilyStoryResponse updateFamilyStory(Long id, FamilyStoryRequest familyStory){
        FamilyStory existingFamilyStory = familyStoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Family story not found with ID: " + id));

        existingFamilyStory.setTitle(familyStory.getTitle());
        existingFamilyStory.setContent(familyStory.getContent());
        existingFamilyStory.setStoryAvatar(familyStory.getStoryAvatar());
        existingFamilyStory.setCoverImage(familyStory.getCoverImage());

        FamilyStory updatedFamilyStory = familyStoryRepository.save(existingFamilyStory);
        return FamilyStoryResponse.fromEntity(updatedFamilyStory);
    };
    
    @Override
    public void deleteFamilyStory(Long id)
    {
        FamilyStory familyStory = familyStoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Family story not found with ID: " + id));
        familyStoryRepository.delete(familyStory);
    }

    @Override
    public List<FamilyStoryResponse> searchFamilyStory(String username, String title) {
        return familyStoryRepository.searchStories(username, title)
                .stream()
                .map(FamilyStoryResponse::fromEntity)
                .toList();
    }

    @Override
    public Page<FamilyStoryResponse> searchStories(String username, String title, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return (Page<FamilyStoryResponse>) familyStoryRepository.searchFamilyStories(username, title, pageable)
                .map(FamilyStoryResponse::fromEntity);
    }

    @Override
    public Page<FamilyStoryResponse> getAllFamilyStories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return familyStoryRepository.findAll(pageable)
                .map(FamilyStoryResponse::fromEntity);
    }

}

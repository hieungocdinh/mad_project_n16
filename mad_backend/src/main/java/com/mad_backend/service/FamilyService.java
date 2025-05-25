package com.mad_backend.service;

import com.mad_backend.dto.request.FamilyRequest;
import com.mad_backend.dto.response.FamilyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FamilyService {
    Page<FamilyResponse> searchFamilies(Long familyTreeId, Long generation, Long familyId, Pageable pageable);

    FamilyResponse createFamily(FamilyRequest request);

    FamilyResponse updateFamily(Long familyId, FamilyRequest request);

    void deleteFamily(Long familyId);

    Page<FamilyResponse> searchFamiliesByName(String name, Pageable pageable);

    FamilyResponse getFamilyById(Long id);

    List<String> suggestFamiliesForUser(Long userId);
}

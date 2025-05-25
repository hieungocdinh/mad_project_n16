package com.mad_backend.service.impl;

import com.mad_backend.dto.entity.FamilyTree;
import com.mad_backend.dto.entity.FamilyTreeFamily;
import com.mad_backend.dto.request.FamilyTreeFamilyRequest;
import com.mad_backend.dto.request.FamilyTreeRequest;
import com.mad_backend.dto.response.FamilyTreeResponse;
import com.mad_backend.repository.FamilyTreeFamilyRepository;
import com.mad_backend.repository.FamilyTreeRepository;
import com.mad_backend.service.FamilyTreeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FamilyTreeServiceImpl implements FamilyTreeService {

    private final FamilyTreeRepository familyTreeRepository;
    private final FamilyTreeFamilyRepository familyTreeFamilyRepository;

    @Override
    public List<FamilyTreeResponse> getListFamilyTrees(FamilyTreeRequest request) {
        return familyTreeRepository.findFamilyTreesByAgeAndName(request.getName(), request.getAge())
                .stream()
                .map(FamilyTreeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public FamilyTreeResponse getFamilyTree(Long id) {
        FamilyTree familyTree = familyTreeRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new NoSuchElementException("Family tree not found with ID: " + id));
        return FamilyTreeResponse.fromEntity(familyTree);
    }

    @Override
    @Transactional
    public FamilyTreeResponse saveFamilyTree(FamilyTreeRequest familyTreeRequest) {
        FamilyTree familyTree = familyTreeRepository.findByIdAndIsDeletedFalse(familyTreeRequest.getId())
                .orElseGet(FamilyTree::new);

        familyTree.setName(familyTreeRequest.getName());
        familyTree.setAge(familyTreeRequest.getAge());
        familyTree.setAvatarUrl(familyTreeRequest.getAvatarUrl());
        familyTree.setGenerationNumbers(familyTreeRequest.getGenerationNumbers());
        FamilyTree savedFamilyTree = familyTreeRepository.save(familyTree);

        saveFamilyTreeFamilies(familyTreeRequest.getFamily(), savedFamilyTree);

        return FamilyTreeResponse.fromEntity(savedFamilyTree);
    }

    private void saveFamilyTreeFamilies(List<FamilyTreeFamilyRequest> familyRequests, FamilyTree familyTree) {
        Set<String> requestedKeys = familyRequests.stream()
                .map(rq -> buildKey(rq.getFamily().getId(), rq.getGeneration()))
                .collect(Collectors.toSet());

        List<FamilyTreeFamily> existingFamilies = familyTreeFamilyRepository.findByFamilyTreeId(familyTree.getId());

        List<FamilyTreeFamily> toDelete = existingFamilies.stream()
                .filter(f -> !requestedKeys.contains(buildKey(f.getFamily().getId(), f.getGeneration())))
                .collect(Collectors.toList());

        List<FamilyTreeFamily> toAdd = familyRequests.stream()
                .filter(rq -> existingFamilies.stream()
                        .noneMatch(existing -> existing.getFamily().getId().equals(rq.getFamily().getId())
                                && existing.getGeneration().equals(rq.getGeneration()))
                )
                .map(rq -> {
                    FamilyTreeFamily familyTreeFamily = new FamilyTreeFamily();
                    familyTreeFamily.setFamily(rq.getFamily());
                    familyTreeFamily.setFamilyTree(familyTree);
                    familyTreeFamily.setGeneration(rq.getGeneration());
                    return familyTreeFamily;
                })
                .collect(Collectors.toList());

        familyTreeFamilyRepository.deleteAll(toDelete);
        familyTreeFamilyRepository.saveAll(toAdd);
    }

    private String buildKey(Long familyId, Integer generation) {
        return familyId + "-" + generation;
    }


    @Override
    public List<FamilyTreeResponse> saveAllFamilyTrees(List<FamilyTreeRequest> requests) {
        return requests.stream()
                .map(this::saveFamilyTree)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteFamilyTree(Long id) {
        FamilyTree familyTree = familyTreeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("FamilyTree not found with ID: " + id));

        familyTree.setDeleted(true);
        familyTreeRepository.save(familyTree);
    }
}

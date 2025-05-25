package com.mad_backend.service.impl;

import com.mad_backend.dto.entity.*;
import com.mad_backend.dto.request.*;
import com.mad_backend.dto.response.*;
import com.mad_backend.enums.FamilyStatus;
import com.mad_backend.repository.FamilyRepository;
import com.mad_backend.repository.UserRepository;
import com.mad_backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FamilyServiceImpl implements FamilyService {

    private final FamilyRepository familyRepository;
    private final FamilyTreeService familyTreeService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ImageService imageService;
    private final AlbumService albumService;

    @Override
    public Page<FamilyResponse> searchFamilies(Long familyTreeId, Long generation, Long familyId, Pageable pageable) {
        Specification<Family> spec = Specification.where(null);

        if (familyTreeId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("familyTree").get("id"), familyTreeId));
        }
        if (generation != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("generation"), generation));
        }
        if (familyId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("id"), familyId));
        }

        return familyRepository.findAll(spec, pageable).map(FamilyResponse::fromEntity);
    }

    @Override
    @Transactional
    public FamilyResponse createFamily(FamilyRequest request) {
        Family family = buildNewFamilyFromRequest(request);
        familyRepository.save(family);

        createImageFromRequest(family, request.getImages());
        createAlbumFromRequest(family, request.getAlbums());

        return FamilyResponse.fromEntity(family);
    }

    private Family buildNewFamilyFromRequest(FamilyRequest request) {
        User husband = getUserIfExists(request.getHusband());
        User wife = getUserIfExists(request.getWife());

        Family family = new Family();
        family.setName(request.getName());
        family.setAvatarUrl(request.getAvatarUrl());
        family.setHusband(husband);
        family.setWife(wife);
        family.setStatus(FamilyStatus.PENDING);
        family.setChildIds(request.getChildIds());
        family.setUsers(new ArrayList<>());

        List<User> users = collectFamilyUsers(husband, wife, request.getChildIds(), family);
        userRepository.saveAll(users);

        return family;
    }

    private User getUserIfExists(User userDto) {
        return userDto != null ? userRepository.findByIdAndIsDeletedFalse(userDto.getId()).orElse(null) : null;
    }

    private List<User> collectFamilyUsers(User husband, User wife, List<Long> childIds, Family family) {
        List<Long> allUserIds = new ArrayList<>(childIds);
        if (husband != null) allUserIds.add(husband.getId());
        if (wife != null) allUserIds.add(wife.getId());

        return allUserIds.stream()
                .map(userRepository::findByIdAndIsDeletedFalse)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .peek(user -> {
                    if (user.getFamilies() == null) user.setFamilies(new ArrayList<>());
                    user.getFamilies().add(family);
                    family.getUsers().add(user);
                })
                .collect(Collectors.toList());
    }

    private void createAlbumFromRequest(Family family, List<AlbumRequest> albumRequests) {
        List<Album> albums = albumRequests.stream()
                .map(request -> albumService.createAlbum(family.getId(), request))
                .map(AlbumResponse::toEntity)
                .toList();

        family.setAlbums(albums);
    }

    private void createImageFromRequest(Family family, List<ImageRequest> imageRequests) {
        List<Image> images = imageService.createImages(family.getId(), imageRequests).stream()
                .map(ImageResponse::toEntity)
                .toList();

        family.setImages(images);
    }

    @Override
    public FamilyResponse updateFamily(Long familyId, FamilyRequest request) {
        Family family = familyRepository.findFamilyByIdAndIsDeletedFalse(familyId)
                .orElseThrow(() -> new RuntimeException("Family not found with ID: " + familyId));

        updateFamilyFromRequest(family, request);
        familyRepository.save(family);

        return FamilyResponse.fromEntity(family);
    }

    private void updateFamilyFromRequest(Family family, FamilyRequest request) {
        User husband = getUserIfExists(request.getHusband());
        User wife = getUserIfExists(request.getWife());

        family.setName(request.getName());
        family.setAvatarUrl(request.getAvatarUrl());
        family.setHusband(husband);
        family.setWife(wife);
        family.setStatus(FamilyStatus.PENDING);
        family.setChildIds(request.getChildIds());

        // Unlink old users
        if (family.getUsers() != null) {
            family.getUsers().forEach(user -> {
                if (user.getFamilies() != null) user.getFamilies().remove(family);
            });
        }

        family.setUsers(new ArrayList<>());
        List<User> users = collectFamilyUsers(husband, wife, request.getChildIds(), family);
        userRepository.saveAll(users);
    }

    @Override
    public void deleteFamily(Long familyId) {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new RuntimeException("Family not found with ID: " + familyId));
        familyRepository.delete(family);
    }

    @Override
    public Page<FamilyResponse> searchFamiliesByName(String name, Pageable pageable) {
        if (name == null || name.isBlank()) {
            return familyRepository.findAll(pageable).map(FamilyResponse::fromEntity);
        }
        return familyRepository.findByNameContaining(name, pageable).map(FamilyResponse::fromEntity);
    }

    @Override
    public FamilyResponse getFamilyById(Long id) {
        return familyRepository.findById(id).map(FamilyResponse::fromEntity).orElse(null);
    }

    @Override
    public List<String> suggestFamiliesForUser(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || user.getProfile().getLastName() == null) {
            return Collections.emptyList();
        }
        List<Family> families = familyRepository.findAll();
        List<String> suggestedFamilyNames = new ArrayList<>();
        for (Family family : families) {
            User father = family.getHusband();
            if (father != null && father.getProfile().getLastName() != null) {
                if (user.getProfile().getLastName().equalsIgnoreCase(father.getProfile().getLastName())) {
                    suggestedFamilyNames.add(family.getName());
                }
            }
        }
        return suggestedFamilyNames;
    }
}
package com.mad_backend.service.impl;

import com.mad_backend.dto.entity.Family;
import com.mad_backend.dto.entity.Profile;
import com.mad_backend.dto.entity.User;
import com.mad_backend.dto.request.ProfileRequest;
import com.mad_backend.dto.response.ProfileResponse;
import com.mad_backend.enums.Role;
import com.mad_backend.mapper.ProfileMapper;
import com.mad_backend.repository.ProfileRepository;
import com.mad_backend.repository.UserRepository;
import com.mad_backend.security.custom.CustomUserDetailsService;
import com.mad_backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;
    private final CustomUserDetailsService userService;

    public ProfileResponse createProfile(ProfileRequest request) {
        String username = Normalizer.normalize((request.getLastName() + request.getFirstName()), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replaceAll("[đĐ]", "d")
                .toLowerCase()
                .replaceAll("\\s+", "");

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setRoles(List.of(Role.USER));
        newUser.setFamilies(new ArrayList<>());
        newUser.setFamilyStories(new ArrayList<>());
        userService.saveUser(newUser);

        Profile profile = new Profile();
        profile.setUser(newUser);
        profile.setAddress(request.getAddress());
        profile.setBiography(request.getBiography());
        profile.setGender(request.getGender());
        profile.setAvatarUrl(request.getAvatarUrl());
        profile.setBirthDate(request.getBirthDate());
        profile.setDeathDate(request.getDeathDate());
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setProfileSetting(false);

        profileRepository.save(profile);
        newUser.setProfile(profile);

        return new ProfileResponse(profile);
    }

    public List<ProfileResponse> getListProfile(Long familyId) {
        List<User> users = userRepository.findByFamilies_IdAndIsDeletedFalse(familyId);

        List<ProfileResponse> dataResponse = new ArrayList<>();
        for (User user : users) {
            if (user.getProfile() == null) {
                throw new NoSuchElementException("Profile not found with userId: " + user.getId());
            }
            ProfileResponse profileResponse = new ProfileResponse(user);
            dataResponse.add(profileResponse);
        }
        return dataResponse;
    }

    public ProfileResponse getDetailProfile(Long profileId) {
        Profile profile = profileRepository.findByIdAndIsDeletedFalse(profileId)
                .orElseThrow(() -> new NoSuchElementException("Profile not found with id: " + profileId));

        ProfileResponse profileResponse = new ProfileResponse(profile);

        Long userId = profile.getUser().getId();
        List<Family> families = profile.getUser().getFamilies();
        Map<String, Object> relations = new HashMap<>();

        for (Family family : families) {
            if (family.getChildIds().contains(userId)) {
                relations.put("father", new ProfileResponse(family.getHusband()));
                relations.put("mother", new ProfileResponse(family.getWife()));
            } else {
                List<User> children = userRepository.findAllByIdInAndIsDeletedFalse(family.getChildIds());
                List<ProfileResponse> childrenResponses = children.stream()
                        .map(ProfileResponse::new)
                        .collect(Collectors.toList());
                relations.put("children", childrenResponses);

                if (family.getHusband().getId().equals(userId)) {
                    relations.put("wife", new ProfileResponse(family.getWife()));
                } else {
                    relations.put("husband", new ProfileResponse(family.getHusband()));
                }
            }
        }

        profileResponse.setRelations(relations);
        return profileResponse;
    }

    public ProfileResponse updateProfile(Long profileId, ProfileRequest profileRequest) {
        Profile profile = profileRepository.findByIdAndIsDeletedFalse(profileId)
                .orElseThrow(() -> new NoSuchElementException("Profile not found!"));

        if (profileRequest.getDeathDate() != null && profileRequest.getBirthDate() != null) {
            if (profileRequest.getDeathDate().isBefore(profileRequest.getBirthDate())) {
                throw new IllegalArgumentException("Death date cannot be earlier than birth date!");
            }
        } else {
            if (profileRequest.getDeathDate() != null && profileRequest.getDeathDate().isBefore(profile.getBirthDate())) {
                throw new IllegalArgumentException("Death date cannot be earlier than birth date!");
            }
            if (profileRequest.getBirthDate() != null && profile.getDeathDate() != null && profileRequest.getBirthDate().isAfter(profile.getDeathDate())) {
                throw new IllegalArgumentException("Birth date cannot be after death date!");
            }
        }

        profileMapper.updateProfileFromRequest(profileRequest, profile);
        Profile updatedProfile = profileRepository.save(profile);

        return new ProfileResponse(updatedProfile);
    }

    @Override
    public void save(Profile profile) {
        profileRepository.save(profile);
    }
}


package com.mad_backend.service;

import com.mad_backend.dto.entity.Profile;
import com.mad_backend.dto.request.ProfileRequest;
import com.mad_backend.dto.response.ProfileResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ProfileService {
    ProfileResponse createProfile(ProfileRequest profileRequest);

    List<ProfileResponse> getListProfile(Long familyId);

    ProfileResponse getDetailProfile(Long profileId);

    ProfileResponse updateProfile(Long profileId, ProfileRequest profileRequest);

    void save(Profile profile);
}

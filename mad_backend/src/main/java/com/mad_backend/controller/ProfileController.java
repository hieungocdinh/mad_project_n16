package com.mad_backend.controller;

import com.mad_backend.dto.request.ProfileRequest;
import com.mad_backend.dto.response.CommonResponse;
import com.mad_backend.dto.response.ProfileResponse;
import com.mad_backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/profiles")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("create")
    public ResponseEntity<CommonResponse<ProfileResponse>> createProfile(
            @RequestBody @Valid ProfileRequest profileRequest) {

        ProfileResponse result = profileService.createProfile(profileRequest);

        return ResponseEntity.ok(new CommonResponse<>(HttpStatus.CREATED.value(), "Create profile successfully!", result));
    }

    @GetMapping("get-list/{family-id}")
    public ResponseEntity<CommonResponse<List<ProfileResponse>>> getListProfile(
            @PathVariable("family-id") Long familyId) {

        List<ProfileResponse> listProfileResponse = profileService.getListProfile(familyId);

        return ResponseEntity.ok(new CommonResponse<>(HttpStatus.OK.value(), "Get list profile successfully!", listProfileResponse));
    }

    @GetMapping("get-detail/{profile-id}")
    public ResponseEntity<CommonResponse<ProfileResponse>> getDetailProfile(
            @PathVariable("profile-id") Long profileId) {

        ProfileResponse result = profileService.getDetailProfile(profileId);

        return ResponseEntity.ok(new CommonResponse<>(HttpStatus.OK.value(), "Get detail profile successfully!", result));
    }

    @PutMapping("update/{profile-id}")
    public ResponseEntity<CommonResponse<ProfileResponse>> updateProfile(
            @PathVariable("profile-id") Long profileId,
            @RequestBody @Valid ProfileRequest profileRequest) {

        ProfileResponse profileResponse = profileService.updateProfile(profileId, profileRequest);

        return ResponseEntity.ok(new CommonResponse<>(HttpStatus.OK.value(), "Updated profile successfully!", profileResponse));
    }
}

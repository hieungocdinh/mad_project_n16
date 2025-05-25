package com.mad_backend.dto.response;

import com.mad_backend.dto.entity.Family;
import com.mad_backend.dto.entity.User;
import com.mad_backend.enums.Role;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Getter
@Setter
@Component
public class UserResponse {
    private Long userId;
    private String username;

    private String email;
    private List<Role> roles;
    private List<Long> familyIds;
    private Long profileId;

    public static UserResponse fromEntity(User entity) {
        UserResponse response = new UserResponse();
        response.setUserId(entity.getId());
        response.setUsername(entity.getUsername());
        response.setEmail(entity.getEmail());
        response.setRoles(entity.getRoles());

        response.setFamilyIds(Optional.ofNullable(entity.getFamilies())
                .orElse(Collections.emptyList())
                .stream()
                .map(Family::getId)
                .collect(Collectors.toList()));


        if (entity.getProfile() != null) {
            response.setProfileId(entity.getProfile().getId());
        }

        return response;
    }

}

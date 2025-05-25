package com.mad_backend.dto.response;

import com.mad_backend.dto.entity.Event;
import com.mad_backend.dto.entity.Family;
import com.mad_backend.dto.entity.FamilyTreeFamily;
import com.mad_backend.dto.entity.User;
import com.mad_backend.enums.FamilyStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class FamilyResponse {
    private Long id;
    private String name;
    private String avatarUrl;
    private UserResponse husband;
    private UserResponse wife;
    private List<Long> childIds;
    private List<Event> events;
    private List<Long> familyTreeId;
    private FamilyStatus familyStatus;

    public static FamilyResponse fromEntity(Family entity) {
        FamilyResponse response = new FamilyResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setAvatarUrl(entity.getAvatarUrl());
        response.setHusband(UserResponse.fromEntity(entity.getHusband()));
        response.setWife(UserResponse.fromEntity(entity.getWife()));
        response.setChildIds(entity.getChildIds());
        response.setEvents(entity.getEvents());
        response.setFamilyStatus(entity.getStatus());

        if(entity.getFamilyTreeFamilies() != null) {
            List<FamilyTreeFamily> familyTreeFamilies = entity.getFamilyTreeFamilies();
            List<Long> familyTreeIds = familyTreeFamilies.stream()
                    .map(FamilyTreeFamily::getId)
                    .toList();
            response.setFamilyTreeId(familyTreeIds);
        }

        return response;
    }
}

package com.mad_backend.dto.response;

import com.mad_backend.dto.entity.FamilyTreeFamily;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FamilyTreeFamilyResponse {
    private Long id;
    private Long familyId;
    private Integer generation;

    public static FamilyTreeFamilyResponse fromEntity(FamilyTreeFamily entity) {
        FamilyTreeFamilyResponse dto = new FamilyTreeFamilyResponse();
        dto.setId(entity.getId());
        dto.setFamilyId(entity.getFamily().getId());
        dto.setGeneration(entity.getGeneration());
        return dto;
    }
}
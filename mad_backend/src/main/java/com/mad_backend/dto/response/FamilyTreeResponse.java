package com.mad_backend.dto.response;

import com.mad_backend.dto.entity.FamilyTree;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class FamilyTreeResponse {
    private Long id;
    private List<FamilyTreeFamilyResponse> families;
    private String name;
    private Integer age;
    private String avatarUrl;
    private Integer generationNumbers;

    public static FamilyTreeResponse fromEntity(FamilyTree entity) {
        FamilyTreeResponse response = new FamilyTreeResponse();
        response.setId(entity.getId());
        if (entity.getFamilyTreeFamilies() != null) {
            response.setFamilies(
                    entity.getFamilyTreeFamilies().stream()
                            .map(FamilyTreeFamilyResponse::fromEntity)
                            .collect(Collectors.toList())
            );
        }
        response.setName(entity.getName());
        response.setAge(entity.getAge());
        response.setGenerationNumbers(entity.getGenerationNumbers());
        response.setAvatarUrl(entity.getAvatarUrl());
        return response;
    }
}

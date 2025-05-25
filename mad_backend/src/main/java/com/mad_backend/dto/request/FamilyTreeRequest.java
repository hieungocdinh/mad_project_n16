package com.mad_backend.dto.request;

import com.mad_backend.dto.entity.Family;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FamilyTreeRequest {
    private Long id;
    private String name;
    private Integer age;
    private String avatarUrl;
    private Integer generationNumbers;
    private List<FamilyTreeFamilyRequest> family;
}

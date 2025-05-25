package com.mad_backend.dto.entity;

import com.mad_backend.dto.response.FamilyTreeResponse;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "family_trees")
public class FamilyTree extends BaseEntity {
    @OneToMany(mappedBy = "familyTree", fetch = FetchType.EAGER)
    private List<FamilyTreeFamily> familyTreeFamilies;

    private String name;
    private Integer age;
    private Integer generationNumbers;
    private String avatarUrl;
}

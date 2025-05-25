package com.mad_backend.dto.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "family_tree_family")
public class FamilyTreeFamily extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "family_tree_id")
//    @JsonIgnore
    private FamilyTree familyTree;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private Family family;

    private Integer generation;
}

package com.mad_backend.enums;

import com.mad_backend.dto.entity.FamilyTree;
import lombok.Getter;

@Getter
public enum Role {
    ADMIN("ADMIN"),
    USER("USER"),
    FAMILY_OWNER("FAMILY_OWNER");

    private final String name;

    Role(String name) {
        this.name = name;
    }
}

package com.mad_backend.enums;

import lombok.Getter;

@Getter
public enum FamilyStatus {
    ACCEPTED("ACCEPTED"),
    PENDING("PENDING"),
    REJECTED("REJECTED");

    private final String name;

    FamilyStatus(String name) {
        this.name = name;
    }
}

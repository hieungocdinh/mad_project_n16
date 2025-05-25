package com.mad_backend.dto.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "profiles")
public class Profile extends BaseEntity {
    @OneToOne
    private User user;

    private String lastName;
    private String firstName;
    private String gender;
    private LocalDate birthDate;
    private LocalDate deathDate;
    private String biography;
    private String address;
    private String avatarUrl;

    private boolean isProfileSetting;
}

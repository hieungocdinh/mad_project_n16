package com.mad_backend.dto.request;

import jakarta.validation.constraints.PastOrPresent;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ProfileRequest {
    private String lastName;
    private String firstName;
    private String gender;
    private String email;
    private String biography;
    private String address;
    private String avatarUrl;
    private Boolean profileSetting;

    @PastOrPresent(message = "Birth date cannot be in the future")
    private LocalDate birthDate;

    @PastOrPresent(message = "Death date cannot be in the future")
    private LocalDate deathDate;
}

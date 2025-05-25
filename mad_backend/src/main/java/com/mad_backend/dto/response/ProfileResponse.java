package com.mad_backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mad_backend.dto.entity.Profile;
import com.mad_backend.dto.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.Period;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProfileResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String firstName;
    private String lastName;
    private String gender;
    private Integer age;
    private LocalDate birthDate;
    private LocalDate deathDate;
    private String biography;
    private String address;
    private String avatarUrl;
    private boolean isProfileSetting;
    private Map<String, Object> relations;

    public ProfileResponse(Profile profile) {
        this.id = profile.getId();
        this.userId = profile.getUser().getId();
        this.fullName = profile.getLastName() + " " + profile.getFirstName();
        this.firstName = profile.getFirstName();
        this.lastName = profile.getLastName();
        this.gender = profile.getGender();
        this.birthDate = profile.getBirthDate();
        this.deathDate = profile.getDeathDate();
        this.biography = profile.getBiography();
        this.address = profile.getAddress();
        this.avatarUrl = profile.getAvatarUrl();
        this.isProfileSetting = profile.isProfileSetting();
    }
    public ProfileResponse(User user) {
        this.id = user.getProfile().getId();
        this.userId = user.getId();
        this.fullName = user.getProfile().getLastName() + " " + user.getProfile().getFirstName();
        this.gender = user.getProfile().getGender();
        this.avatarUrl = user.getProfile().getAvatarUrl();
        this.age = calculateAge(user.getProfile().getBirthDate(), user.getProfile().getDeathDate());
    }

    private Integer calculateAge(LocalDate birthDate, LocalDate deathDate) {
        if (birthDate == null) {
            return null;
        }

        LocalDate endDate = (deathDate != null) ? deathDate : LocalDate.now();
        Period period = Period.between(birthDate, endDate);
        return period.getYears();
    }
}

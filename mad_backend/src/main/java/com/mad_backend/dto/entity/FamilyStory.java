package com.mad_backend.dto.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "family_stories")
@Getter
@Setter
public class FamilyStory extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String title;
    private String content;
    private String storyAvatar;
    private String coverImage;
}

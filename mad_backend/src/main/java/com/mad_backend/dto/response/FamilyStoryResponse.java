package com.mad_backend.dto.response;

import com.mad_backend.dto.entity.Family;
import com.mad_backend.dto.entity.FamilyStory;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class FamilyStoryResponse {
    private Long storyId;
    private Long userId;
    private String UserName;
    private String title;
    private String content;
    private LocalDate creationDate;
    private LocalDate updateDate;
    private String storyAvatar;
    private String coverImage;

    public static FamilyStoryResponse fromEntity(FamilyStory entity) {
        FamilyStoryResponse response = new FamilyStoryResponse();
        response.setStoryId(entity.getId());
        response.setUserId(entity.getUser().getId());
        response.setUserName(entity.getUser().getUsername());
        response.setTitle(entity.getTitle());
        response.setContent(entity.getContent());
        response.setCreationDate(entity.getCreatedAt().toLocalDate());
        response.setUpdateDate(entity.getUpdatedAt().toLocalDate());
        response.setStoryAvatar(entity.getStoryAvatar());
        response.setCoverImage(entity.getCoverImage());
        return response;
    }
}

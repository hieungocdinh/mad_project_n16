package com.mad_backend.dto.request;

import com.mad_backend.dto.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class FamilyStoryRequest {
    private String title;
    private String content;
    private String storyAvatar;
    private String coverImage;

}

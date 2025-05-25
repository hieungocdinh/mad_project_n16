package com.mad_backend.dto.request;

import com.mad_backend.dto.entity.Event;
import com.mad_backend.dto.entity.Image;
import com.mad_backend.dto.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Builder
public class FamilyRequest {
    private String name;
    private String avatarUrl;
    private User husband;
    private User wife;
    private List<Long> childIds;
    private List<ImageRequest> images;
    private List<AlbumRequest> albums;
}

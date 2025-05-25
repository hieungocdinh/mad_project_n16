package com.mad_backend.dto.response;

import com.mad_backend.dto.entity.Image;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@AllArgsConstructor
public class ImageResponse {
    private Long id;
    private String url;
    private LocalDateTime createdAt;

    public ImageResponse(Image image) {
        this.id = image.getId();
        this.url = image.getUrl();
        this.createdAt = image.getCreatedAt();
    }

    public static Image toEntity(ImageResponse imageResponse) {
        Image image = new Image();
        image.setId(imageResponse.getId());
        image.setUrl(imageResponse.getUrl());
        image.setCreatedAt(imageResponse.getCreatedAt());
        return image;
    }
}

package com.mad_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AlbumRequest {
    private String albumName;
    private String coverImageUrl;
    private List<AlbumImageRequest> images;

    @Getter
    @Setter
    public static class AlbumImageRequest {
        private Long id;
    }
}

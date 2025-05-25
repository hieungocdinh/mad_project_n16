package com.mad_backend.dto.response;

import com.mad_backend.dto.entity.Album;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class AlbumResponse {
    private Long id;
    private String albumName;
    private String coverImageUrl;
    private LocalDateTime createdAt;
    private Long totalImages;
    private List<ImageResponse> images;

    public AlbumResponse(Album album) {
        this.id = album.getId();
        this.albumName = album.getAlbumName();
        this.coverImageUrl = album.getCoverImageUrl();
        this.createdAt = album.getCreatedAt();
        this.totalImages = (long) album.getImages().size();
    }

    public static Album toEntity(AlbumResponse album) {
        Album albumEntity = new Album();
        albumEntity.setId(album.getId());
        albumEntity.setAlbumName(album.getAlbumName());
        albumEntity.setCoverImageUrl(album.getCoverImageUrl());
        albumEntity.setCreatedAt(album.getCreatedAt());
        albumEntity.setImages(album.getImages().stream().map(ImageResponse::toEntity).toList());
        return albumEntity;
    }
}

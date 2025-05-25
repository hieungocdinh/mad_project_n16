package com.mad_backend.service.impl;

import com.mad_backend.dto.entity.Album;
import com.mad_backend.dto.entity.Family;
import com.mad_backend.dto.entity.Image;
import com.mad_backend.dto.request.AlbumRequest;
import com.mad_backend.dto.request.ImageRequest;
import com.mad_backend.dto.response.AlbumResponse;
import com.mad_backend.dto.response.ImageResponse;
import com.mad_backend.repository.AlbumRepository;
import com.mad_backend.repository.FamilyRepository;
import com.mad_backend.repository.ImageRepository;
import com.mad_backend.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AlbumServiceImpl implements AlbumService {

    private final AlbumRepository albumRepository;
    private final ImageRepository imageRepository;
    private final FamilyRepository familyRepository;

    public AlbumResponse createAlbum(Long familyId, AlbumRequest albumRequest) {
        Album album = new Album();
        album.setAlbumName(albumRequest.getAlbumName());
        album.setCoverImageUrl(albumRequest.getCoverImageUrl());

        Family family = familyRepository.findFamilyByIdAndIsDeletedFalse(familyId)
                .orElseThrow(() -> new NoSuchElementException("Family not found!"));
        album.setFamily(family);

        List<Image> images = new ArrayList<>();
        for (AlbumRequest.AlbumImageRequest imageRequest : albumRequest.getImages()) {
            Image image = imageRepository.findByIdAndIsDeletedFalse(imageRequest.getId())
                    .orElseThrow(() -> new NoSuchElementException("Image not found with id: " + imageRequest.getId()));
            images.add(image);
        }
        album.setImages(images);

        Album savedAlbum = albumRepository.save(album);

        return new AlbumResponse(savedAlbum);
    }

    public List<AlbumResponse> getListAlbum(Long familyId) {
        List<Album> albums = albumRepository.findByFamily_IdAndIsDeletedFalse(familyId);

        return albums.stream()
                .sorted(Comparator.comparing(Album::getCreatedAt).reversed())
                .map(AlbumResponse::new)
                .toList();
    }

    public AlbumResponse getDetailAlbum(Long albumId) {
        Album album = albumRepository.findByIdAndIsDeletedFalse(albumId)
                .orElseThrow(() -> new NoSuchElementException("Album not found!"));

        List<ImageResponse> imageResponse = album.getImages().stream()
                .sorted(Comparator.comparing(Image::getCreatedAt).reversed())
                .map(ImageResponse::new)
                .toList();

        return new AlbumResponse(
                album.getId(),
                album.getAlbumName(),
                album.getCoverImageUrl(),
                album.getCreatedAt(),
                (long) album.getImages().size(),
                imageResponse
        );
    }

    public AlbumResponse updateAlbum(Long albumId, AlbumRequest albumRequest) {
        Album album = albumRepository.findByIdAndIsDeletedFalse(albumId)
                .orElseThrow(() -> new NoSuchElementException("Album not found!"));

        if (albumRequest.getAlbumName() != null && !albumRequest.getAlbumName().isBlank()) {
            album.setAlbumName(albumRequest.getAlbumName());
        }
        if (albumRequest.getCoverImageUrl() != null && !albumRequest.getCoverImageUrl().isBlank()) {
            album.setCoverImageUrl(albumRequest.getCoverImageUrl());
        }
        if (albumRequest.getImages() != null && !albumRequest.getImages().isEmpty()) {
            List<Image> images = album.getImages();
            for (AlbumRequest.AlbumImageRequest imageRequest : albumRequest.getImages()) {
                Image image = imageRepository.findByIdAndIsDeletedFalse(imageRequest.getId())
                        .orElseThrow(() -> new NoSuchElementException("Image not found with id: " + imageRequest.getId()));
                if (images.contains(image)) {
                    throw new IllegalArgumentException("Image with id " + image.getId() + " already exists in the album.");
                }
                images.add(image);
            }
            album.setImages(images);
        }

        Album updatedAlbum = albumRepository.save(album);

        return new AlbumResponse(updatedAlbum);
    }

    public long deleteImagesOfAlbum(Long albumId, List<ImageRequest> imageRequests) {
        List<Long> imageIds = imageRequests.stream()
                .map(ImageRequest::getId)
                .toList();

        Album album = albumRepository.findByIdAndIsDeletedFalse(albumId)
                .orElseThrow(() -> new NoSuchElementException("Album not found!"));

        List<Image> images = album.getImages();

        long deletedCount = images.stream()
                .filter(image -> imageIds.contains(image.getId()))
                .count();

        if (deletedCount == 0) {
            throw new NoSuchElementException("No images found in this album to delete!");
        }

        images.removeIf(image -> imageIds.contains(image.getId()));
        albumRepository.save(album);

        return deletedCount;
    }

    public void deleteAlbum(Long albumId) {
        Album album = albumRepository.findByIdAndIsDeletedFalse(albumId)
                .orElseThrow(() -> new NoSuchElementException("Album not found!"));

        album.setDeleted(true);
        albumRepository.save(album);
    }
}

package com.mad_backend.service.impl;

import com.mad_backend.dto.entity.Album;
import com.mad_backend.dto.entity.Family;
import com.mad_backend.dto.entity.Image;
import com.mad_backend.dto.request.ImageRequest;
import com.mad_backend.dto.response.ImageResponse;
import com.mad_backend.repository.AlbumRepository;
import com.mad_backend.repository.FamilyRepository;
import com.mad_backend.repository.ImageRepository;
import com.mad_backend.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final FamilyRepository familyRepository;
    private final AlbumRepository albumRepository;

    public List<ImageResponse> createImages(Long familyId, List<ImageRequest> imageRequest) {
        Family family = familyRepository.findFamilyByIdAndIsDeletedFalse(familyId)
                .orElseThrow(() -> new NoSuchElementException("Family not found!"));

        List<Image> images = imageRequest.stream()
                .map(req -> {
                    Image image = new Image();
                    image.setUrl(req.getUrl());
                    image.setFamily(family);
                    return image;
                })
                .toList();

        List<Image> savedImages = imageRepository.saveAll(images);

        return savedImages.stream()
                .map(ImageResponse::new)
                .toList();
    }

    public Map<String, List<ImageResponse>> getListImage(Long familyId) {
        List<ImageResponse> images = imageRepository.findImagesByFamilyId(familyId);

        Map<LocalDate, List<ImageResponse>> groupedByDate = images.stream()
                .collect(Collectors.groupingBy(
                        image -> image.getCreatedAt().toLocalDate()
                ));

        Map<LocalDate, List<ImageResponse>> sortedByDateDesc = new TreeMap<>(Comparator.reverseOrder());
        sortedByDateDesc.putAll(groupedByDate);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        Map<String, List<ImageResponse>> responseData = new LinkedHashMap<>();
        for (Map.Entry<LocalDate, List<ImageResponse>> entry : sortedByDateDesc.entrySet()) {
            List<ImageResponse> sortedImages = entry.getValue().stream()
                    .sorted(Comparator.comparing(ImageResponse::getCreatedAt).reversed())
                    .collect(Collectors.toList());
            responseData.put(entry.getKey().format(formatter), sortedImages);
        }

        return responseData;
    }

    public List<ImageResponse> getListImageForAlbum(Long familyId, Long albumId, Boolean isInAlbum) {
        List<ImageResponse> images;

        if (albumId == null) {
            images = imageRepository.findImagesByFamilyId(familyId);
        } else {
            Album album = albumRepository.findByIdAndIsDeletedFalse(albumId)
                    .orElseThrow(() -> new NoSuchElementException("Album not found!"));
            List<Image> albumImages = album.getImages();

            if (Boolean.TRUE.equals(isInAlbum) || isInAlbum == null) {
                images = albumImages.stream()
                        .map(ImageResponse::new)
                        .toList();
            } else {
                Set<Long> albumImageIds = albumImages.stream()
                        .map(Image::getId)
                        .collect(Collectors.toSet());

                images = imageRepository.findImagesByFamilyId(familyId).stream()
                        .filter(image -> !albumImageIds.contains(image.getId()))
                        .toList();
            }
        }

        return images.stream()
                .sorted(Comparator.comparing(ImageResponse::getCreatedAt).reversed())
                .toList();
    }

    public ImageResponse getDetailImage(Long imageId) {
        Image image = imageRepository.findByIdAndIsDeletedFalse(imageId)
                .orElseThrow(() -> new NoSuchElementException("Image not found!"));

        return new ImageResponse(image);
    }

    public int deleteImages(List<ImageRequest> imageRequests) {
        List<Long> imageIds = imageRequests.stream()
                .map(ImageRequest::getId)
                .collect(Collectors.toList());

        List<Image> images = imageRepository.findAllByIdInAndIsDeletedFalse(imageIds);

        if (images.isEmpty()) {
            throw new NoSuchElementException("No images found to delete!");
        }

        for (Image image : images) {
            List<Album> linkedAlbums = image.getAlbums();
            if (linkedAlbums != null) {
                for (Album album : linkedAlbums) {
                    album.getImages().remove(image);
                }
            }

            image.setAlbums(null);
            image.setDeleted(true);
        }

        imageRepository.saveAll(images);
        return images.size();
    }

}

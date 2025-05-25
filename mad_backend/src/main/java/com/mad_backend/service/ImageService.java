package com.mad_backend.service;

import com.mad_backend.dto.request.ImageRequest;
import com.mad_backend.dto.response.ImageResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface ImageService {
    List<ImageResponse> createImages(Long familyId, List<ImageRequest> imageRequest);

    Map<String, List<ImageResponse>> getListImage(Long familyId);

    List<ImageResponse> getListImageForAlbum(Long familyId, Long albumId, Boolean isInAlbum);

    ImageResponse getDetailImage(Long imageId);

    int deleteImages(List<ImageRequest> imageRequests);
}

package com.mad_backend.service;

import com.mad_backend.dto.request.AlbumRequest;
import com.mad_backend.dto.request.ImageRequest;
import com.mad_backend.dto.response.AlbumResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AlbumService {
    AlbumResponse createAlbum(Long familyId, AlbumRequest albumRequest);

    List<AlbumResponse> getListAlbum(Long familyId);

    AlbumResponse getDetailAlbum(Long albumId);

    AlbumResponse updateAlbum(Long albumId, AlbumRequest albumRequest);

    long deleteImagesOfAlbum(Long albumId, List<ImageRequest> listImage);

    void deleteAlbum(Long albumId);
}

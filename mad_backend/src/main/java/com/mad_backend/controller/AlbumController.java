package com.mad_backend.controller;

import com.mad_backend.dto.request.AlbumRequest;
import com.mad_backend.dto.request.ImageRequest;
import com.mad_backend.dto.response.CommonResponse;
import com.mad_backend.dto.response.AlbumResponse;
import com.mad_backend.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/albums")
@RequiredArgsConstructor
public class AlbumController {
    private final AlbumService albumService;

    @PostMapping("create/{family-id}")
    public ResponseEntity<CommonResponse<AlbumResponse>> createAlbum(
            @PathVariable("family-id") Long familyId,
            @RequestBody AlbumRequest albumRequest) {

        AlbumResponse albumResponse = albumService.createAlbum(familyId, albumRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CommonResponse<>(HttpStatus.CREATED.value(), "Created album successfully!", albumResponse));
    }

    @GetMapping("get-list/{family-id}")
    public ResponseEntity<CommonResponse<List<AlbumResponse>>> getListAlbum(
            @PathVariable("family-id") Long familyId) {

        List<AlbumResponse> albumResponseList = albumService.getListAlbum(familyId);

        return ResponseEntity.ok(new CommonResponse<>(HttpStatus.OK.value(), "Get list album successfully!", albumResponseList));
    }

    @GetMapping("get-detail/{album-id}")
    public ResponseEntity<CommonResponse<AlbumResponse>> getDetailAlbum(
            @PathVariable("album-id") Long albumId) {

        AlbumResponse albumResponse = albumService.getDetailAlbum(albumId);

        return ResponseEntity.ok(new CommonResponse<>(HttpStatus.OK.value(), "Get detail album successfully!", albumResponse));
    }

    @PutMapping("update/{album-id}")
    public ResponseEntity<CommonResponse<AlbumResponse>> updateAlbum(
            @PathVariable("album-id") Long albumId,
            @RequestBody AlbumRequest albumRequest) {

        AlbumResponse albumResponse = albumService.updateAlbum(albumId, albumRequest);

        return ResponseEntity.ok(new CommonResponse<>(HttpStatus.OK.value(), "Updated album successfully!", albumResponse));
    }

    @DeleteMapping("delete-images/{album-id}")
    public ResponseEntity<CommonResponse<String>> deleteImagesOfAlbum(
            @PathVariable("album-id") Long albumId,
            @RequestBody List<ImageRequest> listImage) {

        long deletedCount = albumService.deleteImagesOfAlbum(albumId, listImage);

        String message = "Deleted " + deletedCount + " images from album successfully!";
        return ResponseEntity.ok(new CommonResponse<>(HttpStatus.OK.value(), message, null));
    }

    @DeleteMapping("delete/{album-id}")
    public ResponseEntity<CommonResponse<String>> deleteAlbum(
            @PathVariable("album-id") Long albumId) {

        albumService.deleteAlbum(albumId);

        return ResponseEntity.ok(new CommonResponse<>(HttpStatus.OK.value(), "Deleted album successfully!", null));
    }
}

package com.mad_backend.controller;

import com.mad_backend.dto.request.ImageRequest;
import com.mad_backend.dto.response.ImageResponse;
import com.mad_backend.dto.response.CommonResponse;
import com.mad_backend.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/images")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping("create/{family-id}")
    public ResponseEntity<CommonResponse<List<ImageResponse>>> createImages(
            @PathVariable("family-id") Long familyId,
            @RequestBody List<ImageRequest> imageRequest) {

        List<ImageResponse> data = imageService.createImages(familyId, imageRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CommonResponse<>(HttpStatus.CREATED.value(), "Created images successfully!", data));
    }

    @GetMapping("get-list/{family-id}")
    public ResponseEntity<CommonResponse<Map<String, List<ImageResponse>>>> getListImage(
            @PathVariable("family-id") Long familyId) {

        Map<String, List<ImageResponse>> data = imageService.getListImage(familyId);

        return ResponseEntity.ok(
                new CommonResponse<>(HttpStatus.OK.value(), "Get list image successfully!", data)
        );
    }

    @GetMapping("get-list-for-album/{family-id}")
    public ResponseEntity<CommonResponse<List<ImageResponse>>> getListImageForAlbum(
            @PathVariable("family-id") Long familyId,
            @RequestParam(required = false) Long albumId,
            @RequestParam(required = false) Boolean isInAlbum
    ) {
        List<ImageResponse> data = imageService.getListImageForAlbum(familyId, albumId, isInAlbum);

        return ResponseEntity.ok(
                new CommonResponse<>(HttpStatus.OK.value(), "Get list image for album successfully!", data)
        );
    }

    @GetMapping("get-detail/{image-id}")
    public ResponseEntity<CommonResponse<ImageResponse>> getDetailImage(
            @PathVariable("image-id") Long imageId) {

        ImageResponse data = imageService.getDetailImage(imageId);

        return ResponseEntity.ok(
                new CommonResponse<>(HttpStatus.OK.value(), "Get detail image successfully!", data)
        );
    }

    @DeleteMapping("/delete-images")
    public ResponseEntity<CommonResponse<String>> deleteImages(
            @RequestBody List<ImageRequest> imageRequests) {

        int deletedCount = imageService.deleteImages(imageRequests);
        String message = "Deleted " + deletedCount + " images successfully!";

        return ResponseEntity.ok(
                new CommonResponse<>(HttpStatus.OK.value(), message, null)
        );
    }
}

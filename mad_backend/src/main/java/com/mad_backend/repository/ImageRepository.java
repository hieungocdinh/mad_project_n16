package com.mad_backend.repository;

import com.mad_backend.dto.entity.Image;
import com.mad_backend.dto.response.ImageResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    @Query("SELECT new com.mad_backend.dto.response.ImageResponse(i.id, i.url, i.createdAt) " +
            "FROM Image i WHERE i.family.id = :familyId AND i.isDeleted = false")
    List<ImageResponse> findImagesByFamilyId(@Param("familyId") Long familyId);
    Optional<Image> findByIdAndIsDeletedFalse(Long id);
    List<Image> findAllByIdInAndIsDeletedFalse(List<Long> ids);
}

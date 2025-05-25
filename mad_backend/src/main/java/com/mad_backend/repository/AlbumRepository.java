package com.mad_backend.repository;

import com.mad_backend.dto.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findByFamily_IdAndIsDeletedFalse(Long familyId);
    Optional<Album> findByIdAndIsDeletedFalse(Long id);
}

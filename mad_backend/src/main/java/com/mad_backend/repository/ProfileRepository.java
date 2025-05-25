package com.mad_backend.repository;

import com.mad_backend.dto.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByIdAndIsDeletedFalse(Long id);
    Optional<Profile> findByUserIdAndIsDeletedFalse(Long userId);
}

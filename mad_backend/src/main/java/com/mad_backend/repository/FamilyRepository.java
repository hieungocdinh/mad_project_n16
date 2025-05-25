package com.mad_backend.repository;

import com.mad_backend.dto.entity.Family;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long>, JpaSpecificationExecutor<Family> {
    @Query("SELECT f FROM Family f WHERE f.id = :id AND f.isDeleted = false")
    Optional<Family> findFamilyByIdAndIsDeletedFalse(@Param("id") Long id);

    Page<Family> findByNameContaining(String name, Pageable pageable);
}

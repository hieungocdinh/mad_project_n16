package com.mad_backend.repository;

import com.mad_backend.dto.entity.FamilyTreeFamily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyTreeFamilyRepository extends JpaRepository<FamilyTreeFamily, Long> {
    List<FamilyTreeFamily> findByFamilyTreeId(Long familyTreeId);

    boolean existsByFamilyIdAndFamilyTreeIdAndGeneration(Long familyId, Long familyTreeId, Integer generation);
}

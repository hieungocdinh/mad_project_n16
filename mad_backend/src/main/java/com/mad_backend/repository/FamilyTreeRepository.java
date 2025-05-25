package com.mad_backend.repository;

import com.mad_backend.dto.entity.FamilyTree;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FamilyTreeRepository extends JpaRepository<FamilyTree,Long> {
    @Query("SELECT f FROM FamilyTree f WHERE (:name IS NULL OR f.name = :name) AND (:age IS NULL OR f.age = :age) AND f.isDeleted = FALSE ")
    List<FamilyTree> findFamilyTreesByAgeAndName(@Param("name") String name, @Param("age") Integer age);

    Optional<FamilyTree> findByIdAndIsDeletedFalse(Long id);

}

package com.mad_backend.repository;

import com.mad_backend.dto.entity.FamilyStory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyStoryRepository extends JpaRepository<FamilyStory, Long> {
    // Custom query methods can be defined here if needed
    // For example, to find stories by user ID:
    List<FamilyStory> findAllByUserId(Long userId);
    @Query("SELECT s FROM FamilyStory  s WHERE " +
            "(:username IS NULL OR s.user.username LIKE %:username%) AND " +
            "(:title IS NULL OR s.title LIKE %:title%)")
    List<FamilyStory> searchStories(@Param("username") String username,
                                    @Param("title") String title);

    @Query("SELECT s FROM FamilyStory s WHERE " +
            "(:username IS NULL OR s.user.username LIKE %:username%) AND " +
            "(:title IS NULL OR s.title LIKE %:title%)")
    Page<FamilyStory> searchFamilyStories(@Param("username") String username,
                                    @Param("title") String title,
                                    Pageable pageable);
}

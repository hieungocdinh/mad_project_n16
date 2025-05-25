package com.mad_backend.repository;

import com.mad_backend.dto.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    Optional<User> findByUsernameAndIsDeletedFalse(String username);

    List<User> findAllByIsDeletedFalse();

    Optional<User> findByIdAndIsDeletedFalse(Long id);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> findByFamilies_IdAndIsDeletedFalse(Long familyId);
    List<User> findAllByIdInAndIsDeletedFalse(List<Long> id);
}

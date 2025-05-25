package com.mad_backend.service.impl;

import com.mad_backend.dto.entity.Family;
import com.mad_backend.dto.entity.FamilyTree;
import com.mad_backend.dto.entity.Profile;
import com.mad_backend.dto.entity.User;
import com.mad_backend.dto.request.FamilyTreeRequest;
import com.mad_backend.dto.request.UserRequest;
import com.mad_backend.dto.response.FamilyTreeResponse;
import com.mad_backend.dto.response.UserResponse;
import com.mad_backend.enums.Role;
import com.mad_backend.repository.FamilyRepository;
import com.mad_backend.repository.UserRepository;
import com.mad_backend.service.ProfileService;
import com.mad_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;
    private final ProfileService profileService;

    @Override
    public UserResponse getUserById(Long id) {
        return userRepository.findByIdAndIsDeletedFalse(id)
                .map(UserResponse::fromEntity)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + id));
    }


    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAllByIsDeletedFalse()
                .stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public UserResponse saveUser(UserRequest userRequest) {
        User user = userRepository.findByIdAndIsDeletedFalse(userRequest.getId())
                .orElseGet(User::new);
        user.setUsername(userRequest.getUsername());
        user.setPassword(userRequest.getPassword());
        user.setEmail(userRequest.getEmail());
        user.setRoles(userRequest.getRoles());

        List<Family> families = null;
        if (userRequest.getFamilies() != null && !userRequest.getFamilies().isEmpty()) {
            families = familyRepository.findAllById(
                    userRequest.getFamilies().stream()
                            .map(Family::getId)
                            .collect(Collectors.toList())
            );

            user.setFamilies(families);
            for (Family family : families) {
                family.getUsers().add(user);
            }
        } else {
            user.setFamilies(null); // hoặc Collections.emptyList() nếu bạn muốn là danh sách rỗng
        }


        User savedUser = userRepository.save(user);

        Profile profile = user.getProfile();
        if (profile == null) {
            profile = new Profile();
            profile.setUser(user);
        }
        profile.setAddress("");
        profile.setBiography("");
        profile.setGender("");
        profile.setAvatarUrl("");
        profile.setBirthDate(LocalDate.now());
        profile.setDeathDate(LocalDate.now());
        profile.setFirstName(userRequest.getUsername());
        profile.setLastName(userRequest.getUsername());
        profile.setProfileSetting(false);

        user.setProfile(profile);

        profileService.save(profile);

        return UserResponse.fromEntity(savedUser);
    }

    @Override
    public void deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        user.setDeleted(true);
        userRepository.save(user);
    }

    @Override
    public Page<UserResponse> searchUsers(String username, Pageable pageable) {
        Specification<User> spec = Specification.where(
                (root, query, cb) -> cb.equal(root.get("isDeleted").as(Boolean.class), false)
        );

        if (username != null && !username.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("username")), "%" + username.toLowerCase() + "%"));
        }


        Page<User> users = userRepository.findAll(spec, pageable);
        return users.map(UserResponse::fromEntity);
    }

    @Override
    public List<UserResponse> getUsersWithoutFamily() {
        return userRepository.findAllByIsDeletedFalse()
                .stream()
                .filter(user -> user.getFamilies() == null || user.getFamilies().isEmpty())
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

}

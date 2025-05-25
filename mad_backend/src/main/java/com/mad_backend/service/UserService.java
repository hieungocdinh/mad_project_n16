package com.mad_backend.service;

import com.mad_backend.dto.entity.User;
import com.mad_backend.dto.request.UserRequest;
import com.mad_backend.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    UserResponse saveUser(UserRequest userRequest);
    void deleteUserById(Long id);
    Page<UserResponse> searchUsers(String userName, Pageable pageable);
    List<UserResponse> getUsersWithoutFamily();
}

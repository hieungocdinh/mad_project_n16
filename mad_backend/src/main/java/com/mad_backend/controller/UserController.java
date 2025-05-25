package com.mad_backend.controller;

import com.mad_backend.dto.request.*;
import com.mad_backend.dto.response.CommonResponse;
import com.mad_backend.dto.response.FamilyTreeResponse;
import com.mad_backend.dto.response.UserResponse;
import com.mad_backend.service.AuthService;
import com.mad_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<CommonResponse<UserResponse>> getUser(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(new CommonResponse<>(200, "Get user successfully!", response));
    }

    @GetMapping
    public ResponseEntity<CommonResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> response = userService.getAllUsers();
        return ResponseEntity.ok(new CommonResponse<>(200, "Get all user successfully!", response));
    }

    @PostMapping("/save")
    public ResponseEntity<CommonResponse<UserResponse>> saveUser(@RequestBody UserRequest request) {
        UserResponse response = userService.saveUser(request);
        return ResponseEntity.ok(new CommonResponse<>(200, "Save user successfully!", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CommonResponse<?>> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok(new CommonResponse<>(200, "Deleted user successfully!", null));
    }

    //search theo ten
    @GetMapping("/search")
    public ResponseEntity<CommonResponse<Page<UserResponse>>> searchUsers(
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> result = userService.searchUsers(username, pageable);
        return ResponseEntity.ok(new CommonResponse<>(200, "Search users success", result));
    }

    @GetMapping("/without-family")
    public ResponseEntity<CommonResponse<?>> getUsersWithoutFamily(){
        List<UserResponse> response = userService.getUsersWithoutFamily();
        return ResponseEntity.ok(new CommonResponse<>(200, "Get users successfully!", response));
  }
}

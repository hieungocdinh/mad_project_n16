package com.mad_backend.service;

import com.mad_backend.dto.request.*;
import com.mad_backend.dto.response.CommonResponse;
import com.mad_backend.dto.response.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    String login(AuthRequest authRequest);
    String register(RegisterRequest authRequest);
    String forgotPassword(ForgotPasswordRequest request);
    UserResponse getCurrentUser();

    String resetPassword(ResetPasswordRequest request);

    String changePassword(ChangePasswordRequest request);
}

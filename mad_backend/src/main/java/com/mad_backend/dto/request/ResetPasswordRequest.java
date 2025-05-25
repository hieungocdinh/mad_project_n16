package com.mad_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    private String email;
    private String password;
}

package com.mad_backend.dto.request;

import com.mad_backend.dto.entity.Family;
import com.mad_backend.dto.entity.Profile;
import com.mad_backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserRequest {
    private Long id;
    private String username;
    private String password;
    private String email;
    private List<Role> roles;
    private List<Family> families;
    private Profile profile;
}

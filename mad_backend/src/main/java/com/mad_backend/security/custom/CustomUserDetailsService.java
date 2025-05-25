package com.mad_backend.security.custom;

import com.mad_backend.dto.entity.User;
import com.mad_backend.enums.Role;
import com.mad_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String email) {
        User user = userRepository.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found/deleted!"));
        List<Role> roles = user.getRoles();
        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                roles,
                roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_"+role))
                        .collect(Collectors.toList())
        );
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }
}

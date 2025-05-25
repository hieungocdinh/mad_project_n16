package com.mad_backend.security.jwt;

import com.mad_backend.repository.UserRepository;
import com.mad_backend.security.custom.CustomUserDetails;
import com.mad_backend.security.custom.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    public static final String LOGIN_URI = "/api/v1/auth/login";
    public static final String REGISTER_URI = "/api/v1/auth/register";
    public static final String FORGOT_PASSWORD_URI = "/api/v1/auth/forgot-password";
    public static final String CHANGE_PASSWORD_URI = "/api/users/change-password";
    public static final String CURRENT_USER_URI = "/api/v1/auth/current-user";

    private JwtTokenProvider jwtTokenProvider;
    private CustomUserDetailsService customUserDetailsService;

    private static final List<String> WHITELIST_PATHS = List.of(
            LOGIN_URI,
            REGISTER_URI,
            FORGOT_PASSWORD_URI
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        if (WHITELIST_PATHS.contains(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = getJwtFromRequest(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            Boolean needToReset = (Boolean) jwtTokenProvider.getCheckResetClaim(token);

            if (Boolean.TRUE.equals(needToReset) &&
                    !path.equals(CHANGE_PASSWORD_URI) &&
                    !path.equals(CURRENT_USER_URI)) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Password reset required to use this feature");
                return;
            }

            String email = jwtTokenProvider.getUsernameFromToken(token);
            CustomUserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private Cookie getCookieByName(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return cookie;
                }
            }
        }
        return null;
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

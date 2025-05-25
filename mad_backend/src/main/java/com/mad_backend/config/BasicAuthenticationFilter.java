package com.mad_backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Base64;

public record BasicAuthenticationFilter(String username, String password) implements Filter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String AUTH_METHOD = "Basic";
    private static final String REALM = "Restricted";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String authHeader = httpRequest.getHeader(AUTH_HEADER);

        if (authHeader != null && authHeader.startsWith(AUTH_METHOD)) {
            String encodedCredentials = authHeader.substring(AUTH_METHOD.length()).trim();
            String decodedCredentials = new String(Base64.getDecoder().decode(encodedCredentials));
            String[] credentials = decodedCredentials.split(":", 2);

            if (credentials.length == 2 && isValidCredentials(credentials[0], credentials[1])) {
                chain.doFilter(request, response);
                return;
            }
        }

        httpResponse.setHeader("WWW-Authenticate", "Basic realm=\"" + REALM + "\"");
        httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    }

    private boolean isValidCredentials(String username, String password) {
        return this.username.equals(username) && this.password.equals(password);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void destroy() {
        Filter.super.destroy();
    }

    @Override
    public boolean equals(Object obj) {
        return false;
    }

    @Override
    public int hashCode() {
        return 0;
    }

    @Override
    public String toString() {
        return "";
    }
}
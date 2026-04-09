package com.smartcampus.modules.auth.controller;

import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.repository.UserRepository;
import com.smartcampus.modules.auth.service.AuthCookieService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final AuthCookieService authCookieService;

    public AuthController(UserRepository userRepository, AuthCookieService authCookieService) {
        this.userRepository = userRepository;
        this.authCookieService = authCookieService;
    }

    @GetMapping("/public/google-url")
    public ResponseEntity<Map<String, String>> googleLoginUrl() {
        // Frontend uses this to start OAuth with a full browser redirect.
        return ResponseEntity.ok(Map.of("url", "http://localhost:8080/oauth2/authorization/google"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        String email = null;
        Object principal = authentication.getPrincipal();
        // OAuth2 principal set in attributes 
        // while getName() can be provider subject.
        if (principal instanceof OAuth2User oauth2User) {
            email = oauth2User.getAttribute("email");
        }
        // JWT-authenticated requests resolve email via getName().
        if (email == null || email.isBlank()) {
            email = authentication.getName();
        }
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
        }

        return userRepository.findByEmail(email)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(toDto(user)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found")));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        // Clear HttpOnly auth cookie on the client.
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookieService.clearAuthCookie().toString())
                .body(Map.of("message", "Logged out"));
    }

    private Map<String, Object> toDto(User user) {
        return Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "provider", user.getProvider(),
                "role", user.getRole() != null ? user.getRole().getName() : null,
                "profilePicture", user.getProfilePicture(),
                "status", user.getStatus()
        );
    }
}

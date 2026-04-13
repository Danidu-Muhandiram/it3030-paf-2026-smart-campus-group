package com.smartcampus.modules.auth.controller;

import com.smartcampus.modules.auth.dto.LocalLoginRequest;
import com.smartcampus.modules.auth.dto.LocalRegisterRequest;
import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.repository.UserRepository;
import com.smartcampus.modules.auth.service.AuthCookieService;
import com.smartcampus.modules.auth.service.LocalAuthService;
import com.smartcampus.security.JwtService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final AuthCookieService authCookieService;
    private final LocalAuthService localAuthService;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            AuthCookieService authCookieService,
            LocalAuthService localAuthService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.authCookieService = authCookieService;
        this.localAuthService = localAuthService;
        this.jwtService = jwtService;
    }

    @GetMapping("/public/google-url")
    public ResponseEntity<Map<String, String>> googleLoginUrl() {
        // Frontend uses this to start OAuth with a full browser redirect.
        String oauthUrl = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/oauth2/authorization/google")
                .toUriString();

        return ResponseEntity.ok(Map.of("url", oauthUrl));
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

    @PostMapping("/public/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody LocalRegisterRequest request) {
        try {
            // Create a LOCAL account, then immediately establish an authenticated session.
            User user = localAuthService.register(request);
            String token = jwtService.generateToken(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                // JWT is returned via HttpOnly cookie for browser-based auth.
                    .header(HttpHeaders.SET_COOKIE, authCookieService.createAuthCookie(token).toString())
                    .body(Map.of(
                            "message", "Registration successful",
                            "user", toDto(user)
                    ));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/public/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LocalLoginRequest request) {
        try {
            // Validate email/password against LOCAL account data.
            User user = localAuthService.login(request);
            String token = jwtService.generateToken(user);

            return ResponseEntity.ok()
                // Issue fresh auth cookie on every successful login.
                    .header(HttpHeaders.SET_COOKIE, authCookieService.createAuthCookie(token).toString())
                    .body(Map.of(
                            "message", "Login successful",
                            "user", toDto(user)
                    ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        // Clear HttpOnly auth cookie on the client.
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, authCookieService.clearAuthCookie().toString())
                .body(Map.of("message", "Logged out"));
    }

    private Map<String, Object> toDto(User user) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", user.getId());
        dto.put("email", user.getEmail());
        dto.put("firstName", user.getFirstName());
        dto.put("lastName", user.getLastName());
        dto.put("provider", user.getProvider());
        dto.put("role", user.getRole() != null ? user.getRole().getName() : null);
        dto.put("profilePicture", user.getProfilePicture());
        dto.put("status", user.getStatus());
        return dto;
    }
}

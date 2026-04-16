package com.smartcampus.modules.auth.service;

import com.smartcampus.modules.auth.entity.Role;
import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.model.AuthProvider;
import com.smartcampus.modules.auth.model.UserStatus;
import com.smartcampus.modules.auth.repository.RoleRepository;
import com.smartcampus.modules.auth.repository.UserRepository;
import com.smartcampus.security.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpHeaders;

@Component
@Transactional
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final AuthCookieService authCookieService;
    private final String frontendUrl;

    public OAuth2AuthenticationSuccessHandler(
            UserRepository userRepository,
            RoleRepository roleRepository,
            JwtService jwtService,
            AuthCookieService authCookieService,
            @Value("${app.frontend-url}") String frontendUrl
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.authCookieService = authCookieService;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String fullName = oauth2User.getAttribute("name");
        String providerId = oauth2User.getAttribute("sub");
        String picture = oauth2User.getAttribute("picture");

        if (email == null || email.isBlank()) {
            // Email is required to map OAuth user to a campus account.
            String redirectUrl = UriComponentsBuilder
                    .fromUriString(frontendUrl + "/login")
                    .queryParam("error", "oauth_email_missing")
                    .build()
                    .toUriString();
            getRedirectStrategy().sendRedirect(request, response, redirectUrl);
            return;
        }

        Role defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("Default role USER is missing in database"));

        String resolvedFirstName = "User";
        String resolvedLastName = "";
        if (fullName != null && !fullName.isBlank()) {
            String[] parts = fullName.trim().split("\\s+", 2);
            resolvedFirstName = parts[0];
            resolvedLastName = parts.length > 1 ? parts[1] : "";
        }

        final String firstName = resolvedFirstName;
        final String lastName = resolvedLastName;

        // Update existing user if present, otherwise create a new OAuth user.
        User user = userRepository.findByEmail(email)
                .map(existing -> {
                    existing.setProvider(AuthProvider.GOOGLE);
                    existing.setProviderId(providerId);
                    if (existing.getFirstName() == null || existing.getFirstName().isBlank()) {
                        existing.setFirstName(firstName);
                    }
                    if ((existing.getLastName() == null || existing.getLastName().isBlank()) && !lastName.isBlank()) {
                        existing.setLastName(lastName);
                    }
                    if (picture != null && !picture.isBlank()) {
                        existing.setProfilePicture(picture);
                    }
                    if (existing.getStatus() == null) {
                        existing.setStatus(UserStatus.ACTIVE);
                    }
                    if (existing.getRole() == null) {
                        existing.setRole(defaultRole);
                    }
                    return existing;
                })
                .orElseGet(() -> User.builder()
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
                        .provider(AuthProvider.GOOGLE)
                        .providerId(providerId)
                        .role(defaultRole)
                        .status(UserStatus.ACTIVE)
                        .profilePicture(picture)
                        .build());

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);
        // Use HttpOnly cookie so token is not exposed to frontend JS.
        response.addHeader(HttpHeaders.SET_COOKIE, authCookieService.createAuthCookie(token).toString());

        // Route users to the matching dashboard immediately after OAuth login.
        String role = savedUser.getRole() != null ? savedUser.getRole().getName() : "USER";
        String dashboardPath = "ADMIN".equalsIgnoreCase(role) ? "/admin" : "/dashboard";

        String redirectUrl = UriComponentsBuilder
            .fromUriString(frontendUrl + dashboardPath)
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}

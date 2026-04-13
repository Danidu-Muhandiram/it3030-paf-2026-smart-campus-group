package com.smartcampus.modules.auth.service;

import com.smartcampus.modules.auth.dto.LocalLoginRequest;
import com.smartcampus.modules.auth.dto.LocalRegisterRequest;
import com.smartcampus.modules.auth.entity.Role;
import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.model.AuthProvider;
import com.smartcampus.modules.auth.model.UserStatus;
import com.smartcampus.modules.auth.repository.RoleRepository;
import com.smartcampus.modules.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LocalAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public LocalAuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(LocalRegisterRequest request) {
        // Normalize once so uniqueness checks are case-insensitive.
        String normalizedEmail = normalizeEmail(request.email());
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new IllegalStateException("An account with this email already exists.");
        }

        // LOCAL signups always start with the default USER role.
        Role defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("Default role USER is missing in database"));

        User user = User.builder()
                .firstName(defaultString(request.firstName(), "User"))
                .lastName(defaultString(request.lastName(), ""))
                .universityId(blankToNull(request.universityId()))
                .email(normalizedEmail)
                // Store only a BCrypt hash, never raw passwords.
                .password(passwordEncoder.encode(defaultString(request.password(), "")))
                .provider(AuthProvider.LOCAL)
                .role(defaultRole)
                .status(UserStatus.ACTIVE)
                .build();

        return userRepository.save(user);
    }

    public User login(LocalLoginRequest request) {
        // Email normalization keeps login consistent with registration.
        String normalizedEmail = normalizeEmail(request.email());

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        // Prevent password login for Google-only accounts.
        if (user.getProvider() == AuthProvider.GOOGLE && (user.getPassword() == null || user.getPassword().isBlank())) {
            throw new IllegalArgumentException("This account uses Google sign in.");
        }

        String rawPassword = defaultString(request.password(), "");
        // Compare against stored hash using PasswordEncoder.
        if (user.getPassword() == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return user;
    }

    private String normalizeEmail(String email) {
        return defaultString(email, "").trim().toLowerCase();
    }

    private String defaultString(String value, String fallback) {
        return value == null ? fallback : value.trim();
    }

    private String blankToNull(String value) {
        String trimmed = defaultString(value, "");
        return trimmed.isBlank() ? null : trimmed;
    }
}

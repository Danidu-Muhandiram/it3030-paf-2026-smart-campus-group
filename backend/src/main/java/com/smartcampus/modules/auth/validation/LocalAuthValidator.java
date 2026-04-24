package com.smartcampus.modules.auth.validation;

import com.smartcampus.modules.auth.dto.LocalLoginRequest;
import com.smartcampus.modules.auth.dto.LocalRegisterRequest;
import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.model.AuthProvider;
import com.smartcampus.modules.auth.model.UserStatus;
import com.smartcampus.modules.auth.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class LocalAuthValidator {

    // Keep patterns here so frontend/backend rules stay aligned.
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PASSWORD_POLICY_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-Z\\s\\-']+$");
    private static final Pattern UNIVERSITY_ID_PATTERN = Pattern.compile("^(IT|BS|EN)\\d{6,}$");

    private final UserRepository userRepository;

    public LocalAuthValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public RegisterInput validateRegister(LocalRegisterRequest request) {
        // Normalize early so every check below works on clean values.
        String firstName = requireTrimmed(request.firstName(), "First name is required");
        String lastName = requireTrimmed(request.lastName(), "Last name is required");
        String email = requireTrimmed(request.email(), "Email is required").toLowerCase();
        String universityId = optionalTrimmed(request.universityId());
        String password = requireTrimmed(request.password(), "Password is required");
        String confirmPassword = requireTrimmed(request.confirmPassword(), "Confirm password is required");

        assertMaxLength(firstName, 50, "First name must be at most 50 characters");
        assertMaxLength(lastName, 50, "Last name must be at most 50 characters");
        assertMaxLength(email, 100, "Email must be at most 100 characters");
        assertMaxLength(password, 100, "Password must be at most 100 characters");
        assertMaxLength(confirmPassword, 100, "Confirm password must be at most 100 characters");
        if (universityId != null) {
            assertMaxLength(universityId, 50, "University ID must be at most 50 characters");
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (!NAME_PATTERN.matcher(firstName).matches()) {
            throw new IllegalArgumentException("First name cannot contain numbers or invalid characters");
        }
        if (!NAME_PATTERN.matcher(lastName).matches()) {
            throw new IllegalArgumentException("Last name cannot contain numbers or invalid characters");
        }
        if (universityId != null && !universityId.isBlank() && !UNIVERSITY_ID_PATTERN.matcher(universityId).matches()) {
            throw new IllegalArgumentException("ID Number must start with IT, BS, or EN followed by at least 6 digits (e.g., IT2612345)");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
        if (!PASSWORD_POLICY_PATTERN.matcher(password).matches()) {
            throw new IllegalArgumentException("Password must contain uppercase, lowercase, and a number");
        }
        if (!password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        // Enforce unique identity key before touch persistence.
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalStateException("An account with this email already exists.");
        }

        return new RegisterInput(firstName, lastName, email, blankToNull(universityId), password);
    }

    public LoginInput validateLoginRequest(LocalLoginRequest request) {
        // Login gets strict shape checks, but keeps auth failures generic later.
        String email = requireTrimmed(request.email(), "Email is required").toLowerCase();
        String password = requireTrimmed(request.password(), "Password is required");

        assertMaxLength(email, 100, "Email must be at most 100 characters");
        assertMaxLength(password, 100, "Password must be at most 100 characters");

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }

        return new LoginInput(email, password);
    }

    public void validateLoginUser(User user) {
        // Never leak whether user exists, is disabled, or is OAuth-only.
        if (user.getStatus() != null && user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        if (user.getProvider() == AuthProvider.GOOGLE && (user.getPassword() == null || user.getPassword().isBlank())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
    }

    private String requireTrimmed(String value, String message) {
        String trimmed = optionalTrimmed(value);
        if (trimmed == null || trimmed.isBlank()) {
            throw new IllegalArgumentException(message);
        }
        return trimmed;
    }

    private String optionalTrimmed(String value) {
        return value == null ? null : value.trim();
    }

    private void assertMaxLength(String value, int max, String message) {
        if (value != null && value.length() > max) {
            throw new IllegalArgumentException(message);
        }
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value;
    }

    public record RegisterInput(
            String firstName,
            String lastName,
            String email,
            String universityId,
            String password
    ) {
    }

    public record LoginInput(
            String email,
            String password
    ) {
    }
}

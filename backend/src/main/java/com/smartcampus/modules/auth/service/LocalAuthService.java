package com.smartcampus.modules.auth.service;

import com.smartcampus.modules.auth.dto.LocalLoginRequest;
import com.smartcampus.modules.auth.dto.LocalRegisterRequest;
import com.smartcampus.modules.auth.entity.Role;
import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.model.AuthProvider;
import com.smartcampus.modules.auth.model.UserStatus;
import com.smartcampus.modules.auth.repository.RoleRepository;
import com.smartcampus.modules.auth.repository.UserRepository;
import com.smartcampus.modules.auth.validation.LocalAuthValidator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LocalAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final LocalAuthValidator localAuthValidator;

    public LocalAuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            LocalAuthValidator localAuthValidator
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.localAuthValidator = localAuthValidator;
    }

    public User register(LocalRegisterRequest request) {
        LocalAuthValidator.RegisterInput validated = localAuthValidator.validateRegister(request);

        // LOCAL signups always start with the default USER role.
        Role defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("Default role USER is missing in database"));

        User user = User.builder()
                .firstName(validated.firstName())
                .lastName(validated.lastName())
                .universityId(validated.universityId())
                .email(validated.email())
                // Store only a BCrypt hash, never raw passwords.
                .password(passwordEncoder.encode(validated.password()))
                .provider(AuthProvider.LOCAL)
                .role(defaultRole)
                .status(UserStatus.ACTIVE)
                .build();

        return userRepository.save(user);
    }

    public User login(LocalLoginRequest request) {
        LocalAuthValidator.LoginInput validated = localAuthValidator.validateLoginRequest(request);

        User user = userRepository.findByEmail(validated.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        localAuthValidator.validateLoginUser(user);

        String rawPassword = validated.password();
        // Compare against stored hash using PasswordEncoder.
        if (user.getPassword() == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return user;
    }
}

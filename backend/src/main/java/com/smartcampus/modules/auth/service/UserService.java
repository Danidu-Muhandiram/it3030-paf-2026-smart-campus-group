package com.smartcampus.modules.auth.service;

import com.smartcampus.modules.auth.dto.UserUpdateRequest;
import com.smartcampus.modules.auth.entity.User;
import com.smartcampus.modules.auth.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User updateProfile(String email, UserUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            if (!request.getFirstName().matches("^[a-zA-Z\\s\\-']+$")) {
                throw new IllegalArgumentException("First name cannot contain numbers");
            }
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            if (!request.getLastName().matches("^[a-zA-Z\\s\\-']+$")) {
                throw new IllegalArgumentException("Last name cannot contain numbers");
            }
            user.setLastName(request.getLastName());
        }

        return userRepository.save(user);
    }
}
